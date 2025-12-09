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

// --- Actualizar ---
export const updateProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { name, pricePerPound, wholesalePrice, retailPrice, originCountry, currentStock, imageUrl } = req.body;

        // Validar currentStock
        if (currentStock !== undefined && currentStock < 0) {
            res.status(400).json({ message: 'El stock no puede ser negativo' });
            return;
        }

        // Validar precios
        if ((pricePerPound !== undefined && pricePerPound <= 0.01) ||
            (wholesalePrice !== undefined && wholesalePrice <= 0.01) ||
            (retailPrice !== undefined && retailPrice <= 0.01)) {
            res.status(400).json({ message: 'Los precios deben ser mayores a 0.01' });
            return;
        }

        const updateData: any = {};
        if (name !== undefined) updateData.name = name;
        if (pricePerPound !== undefined) updateData.pricePerPound = pricePerPound;
        if (wholesalePrice !== undefined) updateData.wholesalePrice = wholesalePrice;
        if (retailPrice !== undefined) updateData.retailPrice = retailPrice;
        if (originCountry !== undefined) updateData.originCountry = originCountry;
        if (currentStock !== undefined) updateData.currentStock = currentStock;
        if (imageUrl !== undefined) updateData.imageUrl = imageUrl;

        const updatedProduct = await productRepo.update(id, updateData);

        if (!updatedProduct) {
            res.status(404).json({ message: 'Producto no encontrado' });
            return;
        }

        res.status(200).json({ message: 'Producto actualizado', product: updatedProduct });
    } catch (error) {
        res.status(500).json({ message: 'Error interno', error });
    }
};

// --- Buscar ---
export const searchProducts = async (req: Request, res: Response): Promise<void> => {
    try {
        const { q } = req.query;

        if (!q || q.toString().trim() === '') {
            res.status(400).json({ message: 'Debe proporcionar un término de búsqueda' });
            return;
        }

        const products = await productRepo.search(q.toString());
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error interno', error });
    }
};