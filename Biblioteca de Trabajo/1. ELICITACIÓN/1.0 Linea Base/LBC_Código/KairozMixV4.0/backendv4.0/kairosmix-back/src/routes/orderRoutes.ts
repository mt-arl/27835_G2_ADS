import { Router } from 'express';
import { createOrder, getOrders, cancelOrder, updateOrderStatus } from '../controller/OrderController.js';
import { protectRoute } from '../middleware/authMiddleware.js';

const router = Router();

// Crear pedido (Cliente/Admin)
router.post('/', protectRoute, createOrder);

// Listar pedidos (Admin - Historial)
router.get('/', protectRoute, getOrders);

// Cancelar pedido (Admin o Dueño del pedido) - CU-3.4
router.delete('/:id', protectRoute, cancelOrder); 

// Actualizar estado (Admin) - CU-3.5
router.patch('/:id/status', protectRoute, updateOrderStatus);

export default router;