import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Database } from './database/Database.js'; // Asumiendo que TS resuelve la extensión

// --- IMPORTACIÓN DE RUTAS ---
import productRoutes from './routes/productRoutes.js';
import clientRoutes from './routes/clientRoutes.js';
import orderRoutes from './routes/orderRoutes.js'; 
import authRoutes from './routes/authRoutes.js';   
import mixRoutes from './routes/mixRoutes.js'; 

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Inicializar Singleton DB
const db = Database.getInstance();
db.connect();

// Middlewares Globales
app.use(cors());
app.use(express.json());

// --- DEFINICIÓN DE ENDPOINTS (RUTAS) ---
app.use('/api/products', productRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/auth', authRoutes);     // Endpoint: http://localhost:3000/api/auth/login
app.use('/api/orders', orderRoutes);  // Endpoint: http://localhost:3000/api/orders
app.use('/api/mixes', mixRoutes);

// Iniciar Servidor
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});