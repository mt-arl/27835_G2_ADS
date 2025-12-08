import mongoose from 'mongoose';

export class Database {
    private static instance: Database;

    private constructor() {
        // Constructor privado para evitar 'new Database()'
    }

    public static getInstance(): Database {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }

    public async connect(): Promise<void> {
        const mongoUri = process.env.MONGO_URI;
        if (!mongoUri) {
            console.error('MONGO_URI no definida');
            return;
        }
        try {
            await mongoose.connect(mongoUri);
            console.log('✅ [Singleton] Conexión única a MongoDB establecida.');
        } catch (error) {
            console.error('❌ Error conectando a BD:', error);
        }
    }
}