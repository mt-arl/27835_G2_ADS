import { Router } from 'express';
import { login } from '../controller/AuthController.js'; // Cambiado de loginUser a login

const router = Router();

// El endpoint ahora usa la función 'login'
router.post('/login', login);

export default router;