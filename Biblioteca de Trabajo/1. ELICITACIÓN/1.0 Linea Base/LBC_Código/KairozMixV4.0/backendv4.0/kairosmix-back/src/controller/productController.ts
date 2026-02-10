import { Request, Response } from 'express';
import { RepositoryFactory } from '../factories/RepositoryFactory.js'; // <--- IMPORTAMOS LA FÁBRICA

// USAMOS LA FÁBRICA EN LUGAR DE 'new MongoProductRepository()'
const productRepo = RepositoryFactory.getProductRepository();

// --- Registrar (REQ001) ---
export const createProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, pricePerPound, wholesalePrice, retailPrice, originCountry, initialStock, imageUrl } = req.body;

        // Validaciones de campos requeridos
        if (!name || !originCountry || initialStock === undefined) {
            res.status(400).json({ message: 'Nombre, país de origen e inventario inicial son requeridos' });
            return;
        }

        // REQ001.3: Validaciones de Precios y Stock
        if (pricePerPound <= 0.01 || wholesalePrice <= 0.01 || retailPrice <= 0.01) {
            res.status(400).json({ message: 'Los precios deben ser mayores a 0.01' });
            return;
        }

        if (initialStock < 0) {
            res.status(400).json({ message: 'El stock inicial no puede ser negativo' });
            return;
        }

        // REQ001.2: Generación de Código Automático
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
    } catch (error: any) {
        console.error('Error al crear producto:', error);
        res.status(500).json({ message: 'Error interno al crear producto', error: error.message });
    }
};

// --- Consultar ---
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

        // Validaciones extra para actualización
        if (currentStock !== undefined && currentStock < 0) {
            res.status(400).json({ message: 'El stock no puede ser negativo' });
            return;
        }

        const updateData: any = {};
        if (name) updateData.name = name;
        if (pricePerPound) updateData.pricePerPound = pricePerPound;
        if (wholesalePrice) updateData.wholesalePrice = wholesalePrice;
        if (retailPrice) updateData.retailPrice = retailPrice;
        if (originCountry) updateData.originCountry = originCountry;
        if (currentStock !== undefined) updateData.currentStock = currentStock;
        if (imageUrl) updateData.imageUrl = imageUrl;

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

// --- Desactivar ---
export const deactivateProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const product = await productRepo.deactivateProduct(id);
        
        if (!product) {
            res.status(404).json({ message: 'Producto no encontrado o ya inactivo' });
            return;
        }
        
        res.status(200).json({ message: 'Producto desactivado', product });
    } catch (error) {
        res.status(500).json({ message: 'Error al desactivar producto', error });
    }
};