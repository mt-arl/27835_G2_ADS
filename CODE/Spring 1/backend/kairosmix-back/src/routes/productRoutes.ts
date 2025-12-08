import { Router } from 'express';
// CORRECCIÓN: Verifica si tu carpeta es 'controllers' (plural) o 'controller' (singular)
import { createProduct, getProducts } from '../controller/productController.js'; 

const router = Router();

router.post('/', createProduct);
router.get('/', getProducts);

export default router;