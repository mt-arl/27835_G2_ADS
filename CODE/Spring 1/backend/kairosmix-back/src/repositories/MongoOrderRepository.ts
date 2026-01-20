import Order, { IOrder } from '../models/Order.js';
import {Database} from '../database/Database.js';

export class MongoOrderRepository {
    private db = Database;

    async create(orderData: Partial<IOrder>): Promise<IOrder> {
        await this.db.connect();
        const newOrder = new Order(orderData);
        return await newOrder.save();
    }

    // Aquí TypeScript sabrá que el retorno es un array de IOrder
    async findAll(): Promise<IOrder[]> {
        await this.db.connect();
        return await Order.find()
            .populate('client', 'name email')
            .populate('items.product', 'name price');
    }
}