"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteInvoice = exports.updateInvoice = exports.getInvoice = exports.listInvoices = exports.createInvoice = void 0;
const invoice_model_1 = require("./invoice.model");
const mongoose_1 = __importDefault(require("mongoose"));
const createInvoice = async (req, res) => {
    try {
        const { customer, items, total } = req.body;
        const invoice = await invoice_model_1.Invoice.create({ customer, items, total });
        return res.status(201).json(invoice);
    }
    catch (err) {
        return res.status(400).json({ message: 'Create invoice failed', error: err.message });
    }
};
exports.createInvoice = createInvoice;
const listInvoices = async (req, res) => {
    try {
        const invoices = await invoice_model_1.Invoice.find().sort({ createdAt: -1 });
        return res.status(200).json(invoices);
    }
    catch (err) {
        return res.status(500).json({ message: 'List invoices failed', error: err.message });
    }
};
exports.listInvoices = listInvoices;
const getInvoice = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(id))
            return res.status(400).json({ message: 'Invalid id' });
        const invoice = await invoice_model_1.Invoice.findById(id);
        if (!invoice)
            return res.status(404).json({ message: 'Invoice not found' });
        return res.status(200).json(invoice);
    }
    catch (err) {
        return res.status(500).json({ message: 'Get invoice failed', error: err.message });
    }
};
exports.getInvoice = getInvoice;
const updateInvoice = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(id))
            return res.status(400).json({ message: 'Invalid id' });
        const updated = await invoice_model_1.Invoice.findByIdAndUpdate(id, req.body, { new: true });
        if (!updated)
            return res.status(404).json({ message: 'Invoice not found' });
        return res.status(200).json(updated);
    }
    catch (err) {
        return res.status(500).json({ message: 'Update invoice failed', error: err.message });
    }
};
exports.updateInvoice = updateInvoice;
const deleteInvoice = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(id))
            return res.status(400).json({ message: 'Invalid id' });
        const deleted = await invoice_model_1.Invoice.findByIdAndDelete(id);
        if (!deleted)
            return res.status(404).json({ message: 'Invoice not found' });
        return res.status(200).json({ message: 'Deleted' });
    }
    catch (err) {
        return res.status(500).json({ message: 'Delete invoice failed', error: err.message });
    }
};
exports.deleteInvoice = deleteInvoice;
//# sourceMappingURL=invoice.controller.js.map