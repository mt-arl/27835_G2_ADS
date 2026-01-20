import { Request, Response } from 'express';
import { RepositoryFactory } from '../factories/RepositoryFactory.js';

// Instanciamos los repositorios necesarios
const orderRepo = RepositoryFactory.getOrderRepository('mongo');
const productRepo = RepositoryFactory.getProductRepository('mongo');

export const createOrder = async (req: Request, res: Response) => {
    try {
        const { clientId, items } = req.body; // items: [{ productId, quantity }]

        if (!items || items.length === 0) {
            return res.status(400).json({ message: 'El pedido no tiene productos' });
        }

        let orderItems = [];
        let totalOrder = 0;

        // --- PASO 1: Validación de Stock y Cálculo ---
        for (const item of items) {
            const product = await productRepo.findById(item.productId);

            if (!product) {
                return res.status(404).json({ message: `Producto ${item.productId} no encontrado` });
            }

            if (product.stock < item.quantity) {
                return res.status(400).json({ 
                    message: `Stock insuficiente para: ${product.name}. Disponible: ${product.stock}` 
                });
            }

            // Armamos el item para el pedido con el precio ACTUAL del producto
            orderItems.push({
                product: product._id,
                quantity: item.quantity,
                priceAtPurchase: product.price
            });

            totalOrder += product.price * item.quantity;
        }

        // --- PASO 2: Crear el Pedido ---
        const newOrder = await orderRepo.create({
            client: clientId,
            items: orderItems,
            total: totalOrder,
            status: 'pendiente'
        });

        // --- PASO 3: Restar Stock (Transaccional) ---
        // Nota: Idealmente esto iría en una transacción de Mongo, pero por ahora lo haremos iterativo
        for (const item of items) {
             // Asumiendo que tu ProductRepo tiene un método updateStock
             // Si no, deberíamos agregarlo: await productRepo.updateStock(id, quantity)
             const product = await productRepo.findById(item.productId);
             if(product) {
                 product.stock -= item.quantity;
                 await product.save();
             }
        }

        res.status(201).json(newOrder);

    } catch (error: any) {
        res.status(500).json({ message: 'Error al crear pedido', error: error.message });
    }
};