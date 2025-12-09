import Product, { IProduct } from '../models/Product.js';

export interface IProductRepository {
    create(data: Partial<IProduct>): Promise<IProduct>;
    countByInitial(initial: string): Promise<number>;
    findAll(): Promise<IProduct[]>;
    findById(id: string): Promise<IProduct | null>;
    update(id: string, data: Partial<IProduct>): Promise<IProduct | null>;
}

export class MongoProductRepository implements IProductRepository {
    async create(data: Partial<IProduct>): Promise<IProduct> {
        return await Product.create(data);
    }

    async countByInitial(initial: string): Promise<number> {
        return await Product.countDocuments({ 
            name: { $regex: new RegExp(`^${initial}`, 'i') } 
        });
    }

    async findAll(): Promise<IProduct[]> {
        // Solo devolvemos los activos (Eliminación lógica)
        return await Product.find({ isActive: true });
    }

    async findById(id: string): Promise<IProduct | null> {
        const product = await Product.findById(id);
        if (!product || !product.isActive) {
            return null;
        }
        return product;
    }

    async update(id: string, data: Partial<IProduct>): Promise<IProduct | null> {
        return await Product.findOneAndUpdate(
            { _id: id, isActive: true },
            data,
            { new: true }
        );
    }
}