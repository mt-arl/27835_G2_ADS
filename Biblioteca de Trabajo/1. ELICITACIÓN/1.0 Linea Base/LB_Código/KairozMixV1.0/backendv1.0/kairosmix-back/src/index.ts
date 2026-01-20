import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Database } from './database/Database.js';
import productRoutes from './routes/productRoutes.js';
import clientRoutes from './routes/clientRoutes.js';


dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Inicializar Singleton DB
const db = Database.getInstance();
db.connect();

app.use(cors());
app.use(express.json());
app.use('/api/products', productRoutes);
app.use('/api/clients', clientRoutes);

