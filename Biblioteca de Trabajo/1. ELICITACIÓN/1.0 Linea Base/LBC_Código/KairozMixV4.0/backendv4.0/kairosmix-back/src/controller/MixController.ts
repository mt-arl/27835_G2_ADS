import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware.js';
import { RepositoryFactory } from '../factories/RepositoryFactory.js';
// Importamos la interfaz IProduct para evitar errores de tipo al acceder a nutritionalInfo
import { IProduct } from '../models/Product.js'; 

const mixRepo = RepositoryFactory.getMixRepository();
const productRepo = RepositoryFactory.getProductRepository();

export const createCustomMix = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user.id;
        const { name, ingredients } = req.body; 
        // ingredients: [{ productId: "...", quantityLbs: 0.5 }]

        if (!ingredients || ingredients.length === 0) {
            return res.status(400).json({ message: 'La mezcla debe tener ingredientes' });
        }

        let calculatedTotal = 0;
        let calculatedWeight = 0;
        let calculatedCalories = 0;
        const finalIngredients = [];

        // --- LÓGICA DE NEGOCIO: CÁLCULO DINÁMICO (CU-4.1)  ---
        for (const item of ingredients) {
            // 1. Buscamos el producto real en BD para obtener precios y nutrición
            const product = await productRepo.findById(item.productId) as IProduct;
            
            if (!product) {
                return res.status(404).json({ message: `Producto no encontrado: ${item.productId}` });
            }

            // 2. Validar Stock (La mezcla consume stock) 
            if (product.currentStock < item.quantityLbs) {
                return res.status(400).json({ message: `Stock insuficiente para ${product.name}` });
            }

            // 3. Cálculos de Precios y Nutrición 
            const itemCost = product.pricePerPound * item.quantityLbs;
            // Calculamos calorías proporcionales a la cantidad
            const itemCals = (product.nutritionalInfo?.calories || 0) * item.quantityLbs;

            calculatedTotal += itemCost;
            calculatedWeight += item.quantityLbs;
            calculatedCalories += itemCals;

            finalIngredients.push({
                product: product._id,
                productName: product.name,
                quantityLbs: item.quantityLbs,
                priceAtMoment: product.pricePerPound
            });
        }

        // --- GUARDADO ---
        const newMix = await mixRepo.create({
            client: userId,
            name: name,
            ingredients: finalIngredients,
            totalPrice: parseFloat(calculatedTotal.toFixed(2)), // Req NF-009 (2 decimales) 
            totalWeight: calculatedWeight,
            totalCalories: Math.round(calculatedCalories), // Valor agregado 
            isSaved: true
        });

        res.status(201).json(newMix);

    } catch (error: any) {
        res.status(500).json({ message: 'Error creando mezcla', error: error.message });
    }
};

export const getMyMixes = async (req: AuthRequest, res: Response) => {
    try {
        // Implementación de CU-4.2 (Consultar Mezclas) 
        const mixes = await mixRepo.findByClient(req.user.id);
        res.json(mixes);
    } catch (error: any) {
        res.status(500).json({ message: 'Error obteniendo mezclas', error: error.message });
    }
};