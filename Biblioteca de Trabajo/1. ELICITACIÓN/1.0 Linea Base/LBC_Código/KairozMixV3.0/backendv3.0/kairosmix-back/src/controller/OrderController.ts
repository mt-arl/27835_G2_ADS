import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware.js';
import { RepositoryFactory } from '../factories/RepositoryFactory.js';
// Importamos interfaces para TypeScript
import { IProduct } from '../models/Product.js';
import { ICustomMix } from '../models/CustomMix.js';
import { IOrder } from '../models/Order.js';

const orderRepo = RepositoryFactory.getOrderRepository();
const productRepo = RepositoryFactory.getProductRepository();
const mixRepo = RepositoryFactory.getMixRepository(); 

// --- 1. CREAR PEDIDO (PRODUCTOS Y MEZCLAS) ---
// Cumple: CU-3.1 y validaciones de Stock
export const createOrder = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user.id;
        const { items } = req.body; 

        if (!items || items.length === 0) return res.status(400).json({ message: 'Pedido vacío' });

        let orderItems = [];
        let totalOrder = 0;

        // --- FASE 1: VALIDACIÓN Y CÁLCULO ---
        for (const item of items) {
            
            // CASO A: ES UN PRODUCTO NORMAL
            if (item.productId) {
                const product = await productRepo.findById(item.productId) as IProduct;
                if (!product) return res.status(404).json({ message: `Producto no encontrado` });
                
                if (product.currentStock < item.quantity) {
                    return res.status(400).json({ message: `Sin stock: ${product.name}` });
                }

                orderItems.push({
                    product: product._id,
                    quantity: item.quantity,
                    priceAtPurchase: product.retailPrice
                });
                totalOrder += product.retailPrice * item.quantity;
            } 
            
            // CASO B: ES UNA MEZCLA PERSONALIZADA
            else if (item.mixId) {
                // Buscamos la mezcla
                const mix = await mixRepo.findById(item.mixId) as ICustomMix; 
                
                if (!mix) return res.status(404).json({ message: `Mezcla no encontrada` });

                // Validar Stock de los INGREDIENTES de la mezcla
                for (const ingred of mix.ingredients) {
                     const prodIngred = await productRepo.findById(ingred.product.toString()) as IProduct;
                     // Cantidad necesaria = (Libras en la mezcla) * (Cantidad de bolsas de mezcla pedidas)
                     const requiredQty = ingred.quantityLbs * item.quantity;
                     
                     if (prodIngred.currentStock < requiredQty) {
                         return res.status(400).json({ 
                             message: `No hay stock suficiente de ${prodIngred.name} para fabricar la mezcla` 
                         });
                     }
                }

                orderItems.push({
                    customMix: mix._id,
                    quantity: item.quantity,
                    priceAtPurchase: mix.totalPrice
                });
                totalOrder += mix.totalPrice * item.quantity;
            }
        }

        // --- FASE 2: CREAR PEDIDO ---
        const newOrder = await orderRepo.create({
            client: userId,
            items: orderItems,
            total: totalOrder,
            status: 'pendiente'
        });

        // --- FASE 3: RESTAR STOCK (Transaccional Manual) ---
        for (const item of items) {
            if (item.productId) {
                 // Restar stock producto simple
                 const product = await productRepo.findById(item.productId) as IProduct;
                 product.currentStock -= item.quantity;
                 await product.save();
            } else if (item.mixId) {
                 // Restar stock de ingredientes de la mezcla
                 const mix = await mixRepo.findById(item.mixId) as ICustomMix;
                 for (const ingred of mix.ingredients) {
                     const prodIngred = await productRepo.findById(ingred.product.toString()) as IProduct;
                     const qtyToDeduct = ingred.quantityLbs * item.quantity;
                     prodIngred.currentStock -= qtyToDeduct;
                     await prodIngred.save();
                 }
            }
        }

        res.status(201).json(newOrder);

    } catch (error: any) {
        res.status(500).json({ message: 'Error procesando pedido', error: error.message });
    }
};

// --- 2. LISTAR PEDIDOS ---
// Cumple: Requisito de historial para Admin
export const getOrders = async (req: AuthRequest, res: Response) => {
    try {
        const orders = await orderRepo.findAll();
        res.json(orders || []);
    } catch (error: any) {
        res.status(500).json({ message: 'Error al obtener pedidos', error: error.message });
    }
};

// --- 3. CANCELAR PEDIDO Y RESTAURAR STOCK ---
// Cumple: CU-3.4 y NF-004 (Integridad de Datos)
export const cancelOrder = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        
        // 1. Buscar el pedido (Usamos findById del Repo, o Mongoose directo si el repo no lo expone)
        // Nota: Asegúrate de agregar findById a tu Interfaz IOrderRepository si no está
        // Aquí asumimos que orderRepo tiene un método para buscar por ID
        const order = await orderRepo.findById(id) as unknown as IOrder; 
        
        if (!order) return res.status(404).json({ message: 'Pedido no encontrado' });

        // 2. Validaciones de estado
        if (order.status === 'cancelado') {
            return res.status(400).json({ message: 'El pedido ya está cancelado' });
        }
        if (order.status === 'despachado' || order.status === 'completado') {
            return res.status(400).json({ message: 'No se puede cancelar un pedido ya despachado' });
        }

        // 3. REVERTIR STOCK (Devolver productos al inventario)
        for (const item of order.items) {
            
            // A. Devolver Producto Simple
            if (item.product) {
                const product = await productRepo.findById(item.product.toString()) as IProduct;
                if (product) {
                    product.currentStock += item.quantity;
                    await product.save();
                }
            } 
            
            // B. Devolver Ingredientes de una Mezcla
            else if (item.customMix) {
                const mix = await mixRepo.findById(item.customMix.toString()) as ICustomMix;
                
                if (mix) {
                    for (const ingred of mix.ingredients) {
                        const productIngred = await productRepo.findById(ingred.product.toString()) as IProduct;
                        if (productIngred) {
                            // Cantidad a devolver = (Libras por mezcla) * (Cantidad de mezclas pedidas)
                            const qtyToRestore = ingred.quantityLbs * item.quantity;
                            productIngred.currentStock += qtyToRestore;
                            await productIngred.save();
                        }
                    }
                }
            }
        }

        // 4. Actualizar estado a cancelado
        order.status = 'cancelado';
        await order.save();

        res.json({ message: 'Pedido cancelado y stock restaurado exitosamente', order });

    } catch (error: any) {
        res.status(500).json({ message: 'Error cancelando pedido', error: error.message });
    }
};

// --- 4. ACTUALIZAR ESTADO DEL PEDIDO ---
// Cumple: CU-3.5 (Controlar Estado)
export const updateOrderStatus = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { status } = req.body; // 'en proceso', 'despachado', 'completado'

        const validStatuses = ['pendiente', 'en proceso', 'despachado', 'completado', 'cancelado'];
        
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: `Estado inválido. Permitidos: ${validStatuses.join(', ')}` });
        }

        // Bloquear cancelación por esta vía para forzar el uso de cancelOrder (que restaura stock)
        if (status === 'cancelado') {
            return res.status(400).json({ message: 'Para cancelar usa el endpoint DELETE específico para restaurar stock.' });
        }

        const order = await orderRepo.updateStatus(id, status);

        if (!order) {
            return res.status(404).json({ message: 'Pedido no encontrado' });
        }

        res.json(order);

    } catch (error: any) {
        res.status(500).json({ message: 'Error actualizando estado', error: error.message });
    }
};