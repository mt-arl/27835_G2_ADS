import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Client from '../models/Client.js'; // Si tienes modelo de Cliente, opcional

dotenv.config();

const seedDatabase = async () => {
    try {
        const mongoUri = process.env.MONGO_URI;
        if (!mongoUri) throw new Error("MONGO_URI no definida");

        await mongoose.connect(mongoUri);
        console.log('🔌 Conectado a MongoDB para Seeding...');

        // 1. Limpiar la base de datos (Opcional: borra todo lo anterior)
        await User.deleteMany({});
        await Product.deleteMany({});
        await Client.deleteMany({}); // Si tienes clientes
        console.log('🧹 Base de datos limpiada.');

        // 2. Crear Usuario Admin
        const admin = new User({
            username: "Admin Kairoz",
            email: "admin@kairozmix.com",
            password: "123456", // El hook pre-save lo encriptará
            role: "admin"
        });
        await admin.save();
        console.log('👤 Usuario Admin creado: admin@kairozmix.com / 123456');

        // 3. Crear Productos de Prueba
      // 3. Crear Productos de Prueba (Ajustado a tu Schema real)
        const products = [
            {
                name: "Granola Clásica",
                description: "Avena, miel y nueces",
                category: "Base",
                // Datos de Inventario
                initialStock: 50,
                currentStock: 50,
                minStock: 5, // Asumo que podrías tener este
                // Datos de Precios
                retailPrice: 5.50,      // Precio venta al público
                wholesalePrice: 4.50,   // Precio mayorista
                pricePerPound: 5.50,    // Precio por libra
                // Datos Adicionales
                originCountry: "Ecuador",
                status: "active"        // O el estado por defecto que tengas
            },
            {
                name: "Mix Frutos Rojos",
                description: "Arándanos, fresas y pasas",
                category: "Mezcla",
                initialStock: 30,
                currentStock: 30,
                minStock: 5,
                retailPrice: 7.00,
                wholesalePrice: 6.00,
                pricePerPound: 7.00,
                originCountry: "Ecuador",
                status: "active"
            },
            {
                name: "Chocolate Amargo",
                description: "Chips de chocolate 70%",
                category: "Topping",
                initialStock: 100,
                currentStock: 100,
                minStock: 10,
                retailPrice: 3.25,
                wholesalePrice: 2.50,
                pricePerPound: 3.25,
                originCountry: "Ecuador",
                status: "active"
            }
        ];

        // InsertMany valida contra el esquema, así que ahora debería pasar
        await Product.insertMany(products);
        console.log(`📦 ${products.length} productos insertados.`);

        // 4. Crear un Cliente de Prueba
        // (Asegúrate que coincida con tu Schema de Client)
        /*
        const client = new Client({
            name: "Cliente Prueba",
            email: "cliente@test.com",
            cedula: "1720020030",
            phone: "0999999999",
            address: "Quito, Norte"
        });
        await client.save();
        console.log('🤝 Cliente de prueba creado');
        */

        console.log('✅ Seeding completado exitosamente.');
        process.exit();

    } catch (error) {
        console.error('❌ Error en el Seeding:', error);
        process.exit(1);
    }
};

seedDatabase();