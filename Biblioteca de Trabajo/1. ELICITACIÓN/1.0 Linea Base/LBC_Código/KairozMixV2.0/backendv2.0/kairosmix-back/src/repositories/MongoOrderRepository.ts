import Order, { IOrder } from '../models/Order.js';
import { Database } from '../database/Database.js';

// Definimos la Interfaz (Contrato) que el Factory espera
export interface IOrderRepository {
    create(orderData: Partial<IOrder>): Promise<IOrder>;
    findAll(): Promise<IOrder[]>;
}

export class MongoOrderRepository implements IOrderRepository {
    // CORRECCIÓN: Usamos getInstance() para obtener el Singleton, no la clase cruda
    private db = Database.getInstance();

    async create(orderData: Partial<IOrder>): Promise<IOrder> {
        await this.db.connect(); // Ahora sí funcionará el connect()
        const newOrder = new Order(orderData);
        return await newOrder.save();
    }

    async findAll(): Promise<IOrder[]> {
        await this.db.connect();
        return await Order.find()
            .populate('client', 'name email') // Trae datos del cliente
            .populate('items.product', 'name price'); // Trae datos del producto
    }
}