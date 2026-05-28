import { Schema, model, Types } from 'mongoose';

const ItemSchema = new Schema({
  desc: { type: String, required: true },
  qty: { type: Number, required: true },
  price: { type: Number, required: true },
});

const InvoiceSchema = new Schema({
  customer: { type: String, required: true },
  items: { type: [ItemSchema], default: [] },
  total: { type: Number, required: true },
  status: { type: String, enum: ['draft','pending','paid','cancelled'], default: 'pending' },
  owner: { type: Types.ObjectId, ref: 'User', required: false },
}, { timestamps: true });

export const Invoice = model('Invoice', InvoiceSchema);
