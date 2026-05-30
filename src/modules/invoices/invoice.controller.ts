import { Request, Response } from 'express';
import { Invoice } from './invoice.model';
import mongoose from 'mongoose';

export const createInvoice = async (req: Request, res: Response) => {
  try {
    const { customer, items, total } = req.body;
    const invoice = await Invoice.create({ customer, items, total });
    return res.status(201).json(invoice);
  } catch (err) {
    return res.status(400).json({ message: 'Create invoice failed', error: (err as any).message });
  }
};

export const listInvoices = async (req: Request, res: Response) => {
  try {
    const invoices = await Invoice.find().sort({ createdAt: -1 });
    return res.status(200).json(invoices);
  } catch (err) {
    return res.status(500).json({ message: 'List invoices failed', error: (err as any).message });
  }
};

export const getInvoice = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid id' });
    const invoice = await Invoice.findById(id);
    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
    return res.status(200).json(invoice);
  } catch (err) {
    return res.status(500).json({ message: 'Get invoice failed', error: (err as any).message });
  }
};

export const updateInvoice = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid id' });
    const updated = await Invoice.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Invoice not found' });
    return res.status(200).json(updated);
  } catch (err) {
    return res.status(500).json({ message: 'Update invoice failed', error: (err as any).message });
  }
};

export const deleteInvoice = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid id' });
    const deleted = await Invoice.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'Invoice not found' });
    return res.status(200).json({ message: 'Deleted' });
  } catch (err) {
    return res.status(500).json({ message: 'Delete invoice failed', error: (err as any).message });
  }
};
