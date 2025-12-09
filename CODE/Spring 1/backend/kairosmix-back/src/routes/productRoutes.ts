import { Router } from 'express';
// CORRECCIÓN: Verifica si tu carpeta es 'controllers' (plural) o 'controller' (singular)
import { createProduct, getProducts, updateProduct, searchProducts } from '../controller/productController.js'; 

const router = Router();

router.post('/', createProduct);
router.get('/search', searchProducts);
router.get('/', getProducts);
router.put('/:id', updateProduct);

export default router;