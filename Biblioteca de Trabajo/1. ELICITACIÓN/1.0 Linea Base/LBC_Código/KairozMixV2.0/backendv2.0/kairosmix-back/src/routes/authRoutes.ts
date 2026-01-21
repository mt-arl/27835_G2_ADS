import { Router } from 'express';
import { loginUser } from '../controller/AuthController.js'; // Aquí sí se importa el controlador

const router = Router();
router.post('/login', loginUser);

export default router;