// src/db.ts

import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
        console.warn('⚠️ Advertencia: MONGO_URI no está definido. La API funcionará, pero no podrá acceder a los datos.');
        return; 
    }

    try {
        await mongoose.connect(mongoUri);
        console.log('✅ Conexión exitosa a MongoDB Atlas.');
    } catch (error) {
        console.error('❌ Error de conexión a MongoDB Atlas. Verifique la URL.');
    }
};

export default connectDB;