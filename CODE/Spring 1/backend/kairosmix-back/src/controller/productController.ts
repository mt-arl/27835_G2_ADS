import { Request, Response } from 'express';
import { MongoProductRepository } from '../repositories/ProductRepository.js';

const productRepo = new MongoProductRepository();

export const createProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, pricePerPound, wholesalePrice, retailPrice, originCountry, initialStock, imageUrl } = req.body;

        // --- REQ001.3: Validaciones Backend ---
        if (pricePerPound <= 0.01 || wholesalePrice <= 0.01 || retailPrice <= 0.01) {
            res.status(400).json({ message: 'Los precios deben ser mayores a 0.01' });
            return;
        }
        if (!Number.isInteger(initialStock) || initialStock <= 0) {
            res.status(400).json({ message: 'El stock inicial debe ser un entero positivo' });
            return;
        }

        // --- REQ001.2: Lógica de Generación de Código (M01) ---
        const initial = name.charAt(0).toUpperCase();
        const count = await productRepo.countByInitial(initial);
        const sequence = (count + 1).toString().padStart(2, '0');
        const generatedCode = `${initial}${sequence}`;

        // Guardar usando Repositorio
        const newProduct = await productRepo.create({
            code: generatedCode,
            name,
            pricePerPound,
            wholesalePrice,
            retailPrice,
            originCountry,
            initialStock,
            currentStock: initialStock,
            imageUrl
        });

        res.status(201).json({ message: 'Producto registrado', product: newProduct });

    } catch (error) {
        res.status(500).json({ message: 'Error interno', error });
    }
};