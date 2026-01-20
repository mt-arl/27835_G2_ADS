import User, { IUser } from '../models/User.js';
import { Database } from '../database/Database.js'; // CORRECCIÓN: Import con llaves

// Definimos la Interfaz
export interface IUserRepository {
    create(userData: Partial<IUser>): Promise<IUser>;
    findByEmail(email: string): Promise<IUser | null>;
}

export class MongoUserRepository implements IUserRepository {
    // CORRECCIÓN: Instancia del Singleton
    private db = Database.getInstance(); 

    async create(userData: Partial<IUser>): Promise<IUser> {
        await this.db.connect();
        const newUser = new User(userData);
        return await newUser.save();
    }

    async findByEmail(email: string): Promise<IUser | null> {
        await this.db.connect();
        return await User.findOne({ email });
    }
}