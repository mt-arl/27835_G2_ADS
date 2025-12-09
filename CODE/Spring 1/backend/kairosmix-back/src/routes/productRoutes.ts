import { Router } from 'express';
// CORRECCIÓN: Verifica si tu carpeta es 'controllers' (plural) o 'controller' (singular)
import { createProduct, getProducts, updateProduct } from '../controller/productController.js'; 

const router = Router();

router.post('/', createProduct);
router.get('/', getProducts);
router.put('/:id', updateProduct);

export default router;