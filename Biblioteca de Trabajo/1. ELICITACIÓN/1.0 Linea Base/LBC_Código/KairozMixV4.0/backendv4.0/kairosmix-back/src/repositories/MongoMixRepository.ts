import CustomMix, { ICustomMix } from '../models/CustomMix.js';
import { Database } from '../database/Database.js';

export interface IMixRepository {
    create(mixData: Partial<ICustomMix>): Promise<ICustomMix>;
    findByClient(clientId: string): Promise<ICustomMix[]>;
    findById(id: string): Promise<ICustomMix | null>;
}

export class MongoMixRepository implements IMixRepository {
    private db = Database.getInstance();

    async create(mixData: Partial<ICustomMix>): Promise<ICustomMix> {
        await this.db.connect();
        const newMix = new CustomMix(mixData);
        return await newMix.save();
    }

    async findByClient(clientId: string): Promise<ICustomMix[]> {
        await this.db.connect();
        // Trae las mezclas del cliente, ordenadas por fecha (más recientes primero)
        return await CustomMix.find({ client: clientId }).sort({ createdAt: -1 });
    }

    async findById(id: string): Promise<ICustomMix | null> {
    await this.db.connect();
    return await CustomMix.findById(id);
}
}