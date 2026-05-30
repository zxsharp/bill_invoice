"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const mongoose_1 = __importDefault(require("mongoose"));
const user_model_1 = require("./user.model");
const router = (0, express_1.Router)();
// List users (non-deleted)
router.get('/', async (req, res) => {
    try {
        const users = await user_model_1.User.find({ isDeleted: false }).select('_id name email companyName companyLogo createdAt updatedAt');
        res.status(200).json(users);
    }
    catch (err) {
        res.status(500).json({ message: 'List users failed', error: err.message });
    }
});
// Legacy '/all' path
router.get('/all', async (req, res) => {
    try {
        const users = await user_model_1.User.find({ isDeleted: false }).select('_id name email companyName companyLogo createdAt updatedAt');
        res.status(200).json(users);
    }
    catch (err) {
        res.status(500).json({ message: 'List users failed', error: err.message });
    }
});
// Get user by id
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(id))
            return res.status(400).json({ message: 'Invalid id' });
        const user = await user_model_1.User.findById(id).select('_id name email companyName companyLogo createdAt updatedAt');
        if (!user)
            return res.status(404).json({ message: 'User not found' });
        res.status(200).json(user);
    }
    catch (err) {
        res.status(500).json({ message: 'Get user failed', error: err.message });
    }
});
// Update user
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(id))
            return res.status(400).json({ message: 'Invalid id' });
        const updated = await user_model_1.User.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
        if (!updated)
            return res.status(404).json({ message: 'User not found' });
        res.status(200).json(updated);
    }
    catch (err) {
        res.status(500).json({ message: 'Update user failed', error: err.message });
    }
});
// Delete (soft) user
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(id))
            return res.status(400).json({ message: 'Invalid id' });
        const deleted = await user_model_1.User.findByIdAndUpdate(id, { isDeleted: true, deletedAt: new Date() }, { new: true });
        if (!deleted)
            return res.status(404).json({ message: 'User not found' });
        res.status(200).json({ message: 'Deleted' });
    }
    catch (err) {
        res.status(500).json({ message: 'Delete user failed', error: err.message });
    }
});
// Create user (legacy clients use /create)
router.post('/', async (req, res) => {
    try {
        const { name, email, password, companyName, companyLogo } = req.body;
        const existing = await user_model_1.User.findOne({ email });
        if (existing)
            return res.status(409).json({ message: 'Email already in use' });
        const user = await user_model_1.User.create({ name, email, password, companyName, companyLogo });
        res.status(201).json({ _id: user._id, name: user.name, email: user.email });
    }
    catch (err) {
        res.status(500).json({ message: 'Create user failed', error: err.message });
    }
});
// Legacy '/create' path
router.post('/create', async (req, res) => {
    try {
        const { name, email, password, companyName, companyLogo } = req.body;
        const existing = await user_model_1.User.findOne({ email });
        if (existing)
            return res.status(409).json({ message: 'Email already in use' });
        const user = await user_model_1.User.create({ name, email, password, companyName, companyLogo });
        res.status(201).json({ _id: user._id, name: user.name, email: user.email });
    }
    catch (err) {
        res.status(500).json({ message: 'Create user failed', error: err.message });
    }
});
exports.default = router;
//# sourceMappingURL=user.routes.js.map