import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import RepositoryFactory from '../factories/RepositoryFactory.js';

const userRepo = RepositoryFactory.getUserRepository('mongo');

export const loginUser = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        // 1. Buscar Usuario
        const user = await userRepo.findByEmail(email);
        if (!user) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        // 2. Verificar Password (usando el método que tipamos en la interfaz)
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        // 3. Generar Token JWT
        const token = jwt.sign(
            { id: user._id, role: user.role }, 
            process.env.JWT_SECRET || 'secret_key', 
            { expiresIn: '8h' }
        );

        res.json({
            _id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            token: token
        });

    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};  