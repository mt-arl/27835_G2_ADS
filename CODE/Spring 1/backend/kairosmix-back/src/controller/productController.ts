import { Request, Response } from 'express';
import { MongoProductRepository } from '../repositories/ProductRepository.js';

const productRepo = new MongoProductRepository();

// --- Registrar (Ya lo tenías bien, lo dejo igual) ---
export const createProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, pricePerPound, wholesalePrice, retailPrice, originCountry, initialStock, imageUrl } = req.body;

        if (pricePerPound <= 0.01 || wholesalePrice <= 0.01 || retailPrice <= 0.01) {
            res.status(400).json({ message: 'Precios deben ser > 0.01' });
            return;
        }

        const initial = name.charAt(0).toUpperCase();
        const count = await productRepo.countByInitial(initial);
        const sequence = (count + 1).toString().padStart(2, '0');
        const generatedCode = `${initial}${sequence}`;

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

// --- Consultar (AGREGAR ESTO QUE FALTABA) ---
export const getProducts = async (req: Request, res: Response): Promise<void> => {
    try {
        const products = await productRepo.findAll();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener productos', error });
    }
};