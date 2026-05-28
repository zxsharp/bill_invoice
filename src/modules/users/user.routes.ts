import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';
import { User } from './user.model';

const router = Router();

// List users (non-deleted)
router.get('/', async (req: Request, res: Response) => {
  try {
    const users = await User.find({ isDeleted: false }).select('_id name email companyName companyLogo createdAt updatedAt');
    res.status(200).json(users);
  } catch (err: any) {
    res.status(500).json({ message: 'List users failed', error: err.message });
  }
});

// Legacy '/all' path
router.get('/all', async (req: Request, res: Response) => {
  try {
    const users = await User.find({ isDeleted: false }).select('_id name email companyName companyLogo createdAt updatedAt');
    res.status(200).json(users);
  } catch (err: any) {
    res.status(500).json({ message: 'List users failed', error: err.message });
  }
});

// Get user by id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid id' });
    const user = await User.findById(id).select('_id name email companyName companyLogo createdAt updatedAt');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
  } catch (err: any) {
    res.status(500).json({ message: 'Get user failed', error: err.message });
  }
});

// Update user
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid id' });
    const updated = await User.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(updated);
  } catch (err: any) {
    res.status(500).json({ message: 'Update user failed', error: err.message });
  }
});

// Delete (soft) user
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid id' });
    const deleted = await User.findByIdAndUpdate(id, { isDeleted: true, deletedAt: new Date() }, { new: true });
    if (!deleted) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({ message: 'Deleted' });
  } catch (err: any) {
    res.status(500).json({ message: 'Delete user failed', error: err.message });
  }
});

// Create user (legacy clients use /create)
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, email, password, companyName, companyLogo } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: 'Email already in use' });
    const user = await User.create({ name, email, password, companyName, companyLogo });
    res.status(201).json({ _id: user._id, name: user.name, email: user.email });
  } catch (err: any) {
    res.status(500).json({ message: 'Create user failed', error: err.message });
  }
});

// Legacy '/create' path
router.post('/create', async (req: Request, res: Response) => {
  try {
    const { name, email, password, companyName, companyLogo } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: 'Email already in use' });
    const user = await User.create({ name, email, password, companyName, companyLogo });
    res.status(201).json({ _id: user._id, name: user.name, email: user.email });
  } catch (err: any) {
    res.status(500).json({ message: 'Create user failed', error: err.message });
  }
});

export default router;
