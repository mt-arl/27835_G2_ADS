import Order, { IOrder } from '../models/Order.js';
import { Database } from '../database/Database.js';

// 1. Actualizamos la Interfaz (El Contrato)
export interface IOrderRepository {
    create(orderData: Partial<IOrder>): Promise<IOrder>;
    findAll(): Promise<IOrder[]>;
    // Nuevos métodos requeridos por el controlador:
    findById(id: string): Promise<IOrder | null>;
    updateStatus(id: string, status: string): Promise<IOrder | null>;
}

export class MongoOrderRepository implements IOrderRepository {
    private db = Database.getInstance();

    async create(orderData: Partial<IOrder>): Promise<IOrder> {
        await this.db.connect();
        const newOrder = new Order(orderData);
        return await newOrder.save();
    }

    async findAll(): Promise<IOrder[]> {
        await this.db.connect();
        return await Order.find()
            .populate('client', 'name email')
            .populate('items.product', 'name price') // Para ver info de productos
            .sort({ createdAt: -1 }); // Ordenar por más recientes
    }

    // Implementación para buscar por ID
    async findById(id: string): Promise<IOrder | null> {
        await this.db.connect();
        return await Order.findById(id)
            // Es VITAL hacer populate aquí para que la lógica de cancelar sepa qué productos devolver
            .populate('items.product') 
            .populate('items.customMix');
    }

    // Implementación para actualizar estado
    async updateStatus(id: string, status: string): Promise<IOrder | null> {
        await this.db.connect();
        // { new: true } devuelve el objeto ya actualizado
        return await Order.findByIdAndUpdate(id, { status }, { new: true });
    }
}