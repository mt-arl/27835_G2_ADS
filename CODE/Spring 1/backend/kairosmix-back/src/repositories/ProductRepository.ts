import Product, { IProduct } from '../models/Product.js';

// Interfaz (Contrato)
export interface IProductRepository {
    create(data: Partial<IProduct>): Promise<IProduct>;
    countByInitial(initial: string): Promise<number>;
    exists(code: string): Promise<boolean>;
}

// Implementación Concreta (Mongoose)
export class MongoProductRepository implements IProductRepository {
    async create(data: Partial<IProduct>): Promise<IProduct> {
        return await Product.create(data);
    }

    async countByInitial(initial: string): Promise<number> {
        // Busca productos que empiecen con esa letra (Regex)
        return await Product.countDocuments({ 
            name: { $regex: new RegExp(`^${initial}`, 'i') } 
        });
    }

    async exists(code: string): Promise<boolean> {
        const doc = await Product.findOne({ code });
        return !!doc;
    }
}