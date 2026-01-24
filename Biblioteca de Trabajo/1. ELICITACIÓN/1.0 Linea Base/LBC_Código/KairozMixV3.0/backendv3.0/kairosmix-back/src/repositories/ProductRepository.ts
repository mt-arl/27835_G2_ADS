import Product, { IProduct } from '../models/Product.js';
import { Database } from '../database/Database.js'; // Asegúrate de importar esto

export interface IProductRepository {
    create(data: Partial<IProduct>): Promise<IProduct>;
    countByInitial(initial: string): Promise<number>;
    findAll(): Promise<IProduct[]>;
    findById(id: string): Promise<IProduct | null>;
    update(id: string, data: Partial<IProduct>): Promise<IProduct | null>;
    search(query: string): Promise<IProduct[]>;
    deactivateProduct(id: string): Promise<IProduct | null>;
}

export class MongoProductRepository implements IProductRepository {
    // Instancia del Singleton de conexión
    private db = Database.getInstance();

    async create(data: Partial<IProduct>): Promise<IProduct> {
        await this.db.connect();
        return await Product.create(data);
    }

    async countByInitial(initial: string): Promise<number> {
        await this.db.connect();
        return await Product.countDocuments({ 
            name: { $regex: new RegExp(`^${initial}`, 'i') },
            status: 'active' // Opcional: contar solo los activos
        });
    }

    async findAll(): Promise<IProduct[]> {
        await this.db.connect();
        // CORRECCIÓN: Usamos 'status' en lugar de 'isActive'
        return await Product.find({ status: 'active' });
    }

    async findById(id: string): Promise<IProduct | null> {
        await this.db.connect();
        const product = await Product.findById(id);
        
        // CORRECCIÓN: Validamos contra 'status'
        if (!product || product.status !== 'active') {
            return null;
        }
        return product;
    }

    async update(id: string, data: Partial<IProduct>): Promise<IProduct | null> {
        await this.db.connect();
        return await Product.findOneAndUpdate(
            { _id: id, status: 'active' }, // CORRECCIÓN
            data,
            { new: true }
        );
    }

    async search(query: string): Promise<IProduct[]> {
        await this.db.connect();
        const regex = new RegExp(query, 'i');
        return await Product.find({
            $or: [
                { code: regex },
                { name: regex }
            ],
            status: 'active' // CORRECCIÓN
        });
    }

    async deactivateProduct(id: string): Promise<IProduct | null> {
        await this.db.connect();
        // Cambiamos el estado a 'inactive' en lugar de false
        return await Product.findOneAndUpdate(
            { _id: id, status: 'active' },
            { status: 'inactive' }, 
            { new: true }
        );
    }
}