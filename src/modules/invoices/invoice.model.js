"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Invoice = void 0;
const mongoose_1 = require("mongoose");
const ItemSchema = new mongoose_1.Schema({
    desc: { type: String, required: true },
    qty: { type: Number, required: true },
    price: { type: Number, required: true },
});
const InvoiceSchema = new mongoose_1.Schema({
    customer: { type: String, required: true },
    items: { type: [ItemSchema], default: [] },
    total: { type: Number, required: true },
    status: { type: String, enum: ['draft', 'pending', 'paid', 'cancelled'], default: 'pending' },
    owner: { type: mongoose_1.Types.ObjectId, ref: 'User', required: false },
}, { timestamps: true });
exports.Invoice = (0, mongoose_1.model)('Invoice', InvoiceSchema);
//# sourceMappingURL=invoice.model.js.map