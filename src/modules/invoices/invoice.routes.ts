import { Router } from 'express';
import { createInvoice, listInvoices, getInvoice, updateInvoice, deleteInvoice } from './invoice.controller';

const router = Router();

router.post('/', createInvoice);
// Legacy endpoint used by some clients: POST /api/invoice/create
router.post('/create', createInvoice);
router.get('/', listInvoices);
// Support legacy '/all' path used by some clients
router.get('/all', listInvoices);
router.get('/:id', getInvoice);
router.put('/:id', updateInvoice);
router.delete('/:id', deleteInvoice);

export default router;
