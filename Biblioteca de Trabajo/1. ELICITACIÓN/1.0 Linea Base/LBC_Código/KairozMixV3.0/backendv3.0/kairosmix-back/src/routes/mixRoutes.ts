import { Router } from 'express';
import { createCustomMix, getMyMixes } from '../controller/MixController.js';
import { protectRoute } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/', protectRoute, createCustomMix);
router.get('/', protectRoute, getMyMixes);

export default router;