import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extendemos la interfaz de Request para incluir el usuario decodificado
export interface AuthRequest extends Request {
    user?: any;
}

export const protectRoute = (req: AuthRequest, res: Response, next: NextFunction) => {
    let token;

    // 1. Verificamos si hay un token en el header (Bearer Token)
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // "Bearer abcd123..." -> Separamos y tomamos el token
            token = req.headers.authorization.split(' ')[1];

            // 2. Verificamos la firma del token
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key');

            // 3. Adjuntamos el usuario decodificado a la request
            req.user = decoded;

            next(); // ¡Pase usted!
        } catch (error) {
            console.error('Error de Token:', error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};