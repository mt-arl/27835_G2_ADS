// src/index.ts

import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import connectDB from './db.js';

// Cargar variables de entorno del archivo .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Intenta conectar a la DB (no bloquea el inicio del servidor)
connectDB(); 

// Middleware
app.use(express.json()); 

// Ruta de Prueba
app.get('/', (req: Request, res: Response) => {
    // Agregamos un console.log aquí para confirmar que esta ruta sí se ejecuta
    console.log('Petición recibida en /');
    res.send('Servidor KairosMix Back-end inicializado. Estado de DB: Revisar consola.');
});

// Inicio del Servidor
// --- CAMBIO CLAVE: Usamos una función asíncrona principal (aunque no siempre es necesario, 
// es más seguro para entornos modernos) ---
const startServer = async () => {
    app.listen(PORT, () => {
        console.log(`\n-----------------------------------------`);
        console.log(`🚀 Servidor de KairosMix corriendo en http://localhost:${PORT}`);
        console.log(`-----------------------------------------`);
    });
}

// Llamar a la función principal
startServer();

// IMPORTANTE: Asegúrate de que no haya código de inicialización o manejo 
// de errores asíncronos que llame a process.exit() en db.ts o index.ts. 
// (Ya corregimos esto en los pasos anteriores, pero es la causa principal del "clean exit").