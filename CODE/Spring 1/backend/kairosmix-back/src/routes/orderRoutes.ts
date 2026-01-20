import { Router } from 'express';
import { createOrder } from '../controller/OrderController.js';
import { protectRoute } from '../middleware/authMiddleware.js'; // El guardián

const router = Router();
router.post('/', protectRoute, createOrder); // Ruta protegida

export default router;