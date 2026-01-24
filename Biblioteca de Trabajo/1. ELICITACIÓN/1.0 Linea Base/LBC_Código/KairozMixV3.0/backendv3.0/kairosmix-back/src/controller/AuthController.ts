import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';     // Modelo de Admins
import Client from '../models/Client.js'; // Modelo de Clientes

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        // 1. Intentar buscar primero en la colección de Usuarios (Admins)
        let account = await User.findOne({ email });
        let role = 'admin';

        // 2. Si no existe en Admins, buscar en la colección de Clientes
        if (!account) {
            // Nota: En tu modelo de Cliente el campo se llama 'correo'
            account = await Client.findOne({ correo: email });
            role = 'client';
        }

        // 3. Si no se encontró en ninguna de las dos colecciones
        if (!account) {
            return res.status(401).json({ message: "Credenciales inválidas" });
        }

        // 4. Verificar la contraseña usando bcrypt
        // Ambos modelos (User y Client) ya tienen el hash gracias al pre('save')
        const isMatch = await bcrypt.compare(password, account.password);

        if (!isMatch) {
            return res.status(401).json({ message: "Credenciales inválidas" });
        }

        // 5. Generar el Token JWT
        // ... dentro de la función login ...
        const token = jwt.sign(
            { id: account._id, role: role },
            process.env.JWT_SECRET || 'KAIROZ_MASTER_KEY', // <--- Cambia esto
            { expiresIn: '24h' }
        );

        // 6. Enviar respuesta unificada para el Front
        // Usamos account.username (para admin) o account.nombre (para cliente)
        res.json({
            token,
            user: {
                id: account._id,
                username: account.username || account.nombre,
                role: role,
                email: account.email || account.correo
            }
        });

    } catch (error: any) {
        console.error("Error en Login:", error);
        res.status(500).json({ message: "Error interno en el servidor" });
    }
};