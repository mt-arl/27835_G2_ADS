import User, { IUser } from '../models/User.js';
import Database from '../database/Database.js';

export class MongoUserRepository {
    private db = Database; // Singleton

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