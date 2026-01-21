import Client, { IClient } from '../models/Client.js';

export interface IClientRepository {
    create(data: Partial<IClient>): Promise<IClient>;
    findByCedula(cedula: string): Promise<IClient | null>;
    findAll(): Promise<IClient[]>;
    findById(id: string): Promise<IClient | null>;
    update(id: string, data: Partial<IClient>): Promise<IClient | null>;
    deactivate(id: string): Promise<IClient | null>;
}

export class MongoClientRepository implements IClientRepository {
    async create(data: Partial<IClient>): Promise<IClient> {
        return await Client.create(data);
    }

    async findByCedula(cedula: string): Promise<IClient | null> {
        return await Client.findOne({ cedula, isActive: true });
    }

    async findAll(): Promise<IClient[]> {
        return await Client.find({ isActive: true }).sort({ createdAt: -1 });
    }

    async findById(id: string): Promise<IClient | null> {
        const client = await Client.findById(id);
        if (!client || !client.isActive) {
            return null;
        }
        return client;
    }

    async update(id: string, data: Partial<IClient>): Promise<IClient | null> {
        return await Client.findOneAndUpdate(
            { _id: id, isActive: true },
            data,
            { new: true }
        );
    }

    async deactivate(id: string): Promise<IClient | null> {
        return await Client.findOneAndUpdate(
            { _id: id, isActive: true },
            { isActive: false },
            { new: true }
        );
    }
}
