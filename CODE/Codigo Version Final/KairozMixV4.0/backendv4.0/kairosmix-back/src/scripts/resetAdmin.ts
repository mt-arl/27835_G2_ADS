import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const resetAdmin = async () => {
    try {
        if (!process.env.MONGO_URI) throw new Error("Falta MONGO_URI en .env");
        await mongoose.connect(process.env.MONGO_URI);
        console.log('🔌 Conectado a MongoDB...');

        // Borramos cualquier rastro del admin previo
        await User.deleteMany({ email: "admin@kairozmix.com" });

        // Creamos el usuario enviando la clave tal cual: "123456"
        // El modelo User.ts se encargará de encriptarla al hacer .save()
        const admin = new User({
            username: "Super Admin",
            email: "admin@kairozmix.com",
            password: "123456", 
            role: "admin"
        });

        await admin.save();
        console.log('✅ Admin creado exitosamente.');
        console.log('📧 Email: admin@kairozmix.com');
        console.log('🔑 Password: 123456');
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

resetAdmin();