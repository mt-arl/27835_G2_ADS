import Product, { IProduct } from '../models/Product.js';

export interface IProductRepository {
    create(data: Partial<IProduct>): Promise<IProduct>;
    countByInitial(initial: string): Promise<number>;
    findAll(): Promise<IProduct[]>; // <--- AGREGAR ESTO
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

    // <--- IMPLEMENTAR ESTO
    async findAll(): Promise<IProduct[]> {
        // Solo devolvemos los activos (Eliminación lógica)
        return await Product.find({ isActive: true });
    }
}