"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const invoice_controller_1 = require("./invoice.controller");
const router = (0, express_1.Router)();
router.post('/', invoice_controller_1.createInvoice);
// Legacy endpoint used by some clients: POST /api/invoice/create
router.post('/create', invoice_controller_1.createInvoice);
router.get('/', invoice_controller_1.listInvoices);
// Support legacy '/all' path used by some clients
router.get('/all', invoice_controller_1.listInvoices);
router.get('/:id', invoice_controller_1.getInvoice);
router.put('/:id', invoice_controller_1.updateInvoice);
router.delete('/:id', invoice_controller_1.deleteInvoice);
exports.default = router;
//# sourceMappingURL=invoice.routes.js.map