import { Router } from 'express';
import { 
    createClient, 
    getClients, 
    getClientById, 
    updateClient, 
    deactivateClient 
} from '../controller/clientController.js';

const router = Router();

router.post('/', createClient);
router.get('/', getClients);
router.get('/:id', getClientById);
router.put('/:id', updateClient);
router.patch('/:id/deactivate', deactivateClient);

export default router;
