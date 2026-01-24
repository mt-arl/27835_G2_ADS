import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';

dotenv.config();

const seedDatabase = async () => {
    try {
        const mongoUri = process.env.MONGO_URI;
        if (!mongoUri) throw new Error("MONGO_URI no definida");

        await mongoose.connect(mongoUri);
        console.log('🔌 Conectado a MongoDB...');

        // 1. Limpiar la base de datos para no duplicar
        await Product.deleteMany({});
        await User.deleteMany({});
        console.log('🧹 Base de datos limpiada.');

        // 2. Crear Admin
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash("123456", salt);
        
        const admin = new User({
            username: "Admin Kairos",
            email: "admin@kairozmix.com",
            password: hashedPassword, // Hasheado manualmente para evitar problemas de hooks en insertMany si se usara
            role: "admin"
        });
        await admin.save();
        console.log('👤 Usuario Admin creado (admin@kairozmix.com / 123456)');

        // 3. CATALOGO DE PRODUCTOS KAIROS MIX
        const products = [
            // --- BASES ---
            {
                code: "BAS-001",
                name: "Granola Clásica Miel",
                description: "Base crujiente de avena horneada con miel",
                category: "Bases",
                pricePerPound: 3.50,
                retailPrice: 4.00,
                wholesalePrice: 3.00,
                currentStock: 200,
                minStock: 20,
                originCountry: "Ecuador",
                nutritionalInfo: { calories: 1900, protein: 50, fat: 70, carbs: 320 }
            },
            {
                code: "BAS-002",
                name: "Hojuelas de Avena",
                description: "Avena precocida natural sin azúcar",
                category: "Bases",
                pricePerPound: 1.50,
                retailPrice: 2.00,
                wholesalePrice: 1.20,
                currentStock: 300,
                minStock: 50,
                originCountry: "Ecuador",
                nutritionalInfo: { calories: 1700, protein: 60, fat: 30, carbs: 300 }
            },

            // --- FRUTOS SECOS (NUTS) ---
            {
                code: "NUT-001",
                name: "Almendras Enteras",
                description: "Almendras naturales sin sal",
                category: "Frutos Secos",
                pricePerPound: 8.50,
                retailPrice: 9.50,
                wholesalePrice: 7.50,
                currentStock: 100,
                minStock: 10,
                originCountry: "USA",
                nutritionalInfo: { calories: 2600, protein: 96, fat: 220, carbs: 90 }
            },
            {
                code: "NUT-002",
                name: "Nueces del Nogal",
                description: "Nueces mariposa premium",
                category: "Frutos Secos",
                pricePerPound: 7.00,
                retailPrice: 8.00,
                wholesalePrice: 6.00,
                currentStock: 80,
                minStock: 10,
                originCountry: "Chile",
                nutritionalInfo: { calories: 2900, protein: 68, fat: 290, carbs: 60 }
            },
            {
                code: "NUT-003",
                name: "Maní Tostado",
                description: "Maní sin sal añadido",
                category: "Frutos Secos",
                pricePerPound: 2.50,
                retailPrice: 3.00,
                wholesalePrice: 2.00,
                currentStock: 150,
                minStock: 20,
                originCountry: "Ecuador",
                nutritionalInfo: { calories: 2500, protein: 110, fat: 220, carbs: 70 }
            },

            // --- FRUTAS DESHIDRATADAS ---
            {
                code: "FRU-001",
                name: "Arándanos Deshidratados",
                description: "Arándanos rojos dulces",
                category: "Frutas",
                pricePerPound: 6.50,
                retailPrice: 7.50,
                wholesalePrice: 5.50,
                currentStock: 120,
                minStock: 15,
                originCountry: "USA",
                nutritionalInfo: { calories: 1400, protein: 2, fat: 5, carbs: 370 }
            },
            {
                code: "FRU-002",
                name: "Pasas Rubias",
                description: "Pasas grandes sin semilla",
                category: "Frutas",
                pricePerPound: 3.00,
                retailPrice: 3.50,
                wholesalePrice: 2.50,
                currentStock: 150,
                minStock: 20,
                originCountry: "Chile",
                nutritionalInfo: { calories: 1300, protein: 15, fat: 0, carbs: 350 }
            },
            {
                code: "FRU-003",
                name: "Coco Rallado",
                description: "Coco deshidratado sin azúcar",
                category: "Frutas",
                pricePerPound: 4.00,
                retailPrice: 4.80,
                wholesalePrice: 3.20,
                currentStock: 90,
                minStock: 10,
                originCountry: "Ecuador",
                nutritionalInfo: { calories: 3000, protein: 30, fat: 290, carbs: 100 }
            },

            // --- TOPPINGS ---
            {
                code: "TOP-001",
                name: "Chispas de Chocolate 70%",
                description: "Chocolate semiamargo",
                category: "Toppings",
                pricePerPound: 5.50,
                retailPrice: 6.50,
                wholesalePrice: 4.50,
                currentStock: 100,
                minStock: 10,
                originCountry: "Ecuador",
                nutritionalInfo: { calories: 2200, protein: 30, fat: 150, carbs: 250 }
            },
            {
                code: "TOP-002",
                name: "Semillas de Girasol",
                description: "Pelas y tostadas",
                category: "Toppings",
                pricePerPound: 3.20,
                retailPrice: 3.80,
                wholesalePrice: 2.50,
                currentStock: 80,
                minStock: 10,
                originCountry: "Argentina",
                nutritionalInfo: { calories: 2600, protein: 90, fat: 230, carbs: 90 }
            }
        ];

        // Insertar uno por uno para asegurar validaciones si fuera necesario, 
        // pero insertMany es más rápido para seeders.
        await Product.insertMany(products);
        console.log(`📦 ${products.length} productos insertados en el catálogo.`);

        console.log('✅ Seeding completado exitosamente.');
        process.exit();

    } catch (error) {
        console.error('❌ Error en el Seeding:', error);
        process.exit(1);
    }
};

seedDatabase();