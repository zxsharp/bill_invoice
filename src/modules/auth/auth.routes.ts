import { Router } from 'express';
import { validate } from '../../middleware/validate';
import { registerSchema, loginSchema } from './auth.schema';
import { register, login, refresh, logout, me } from './auth.controller';
import cookieParser from 'cookie-parser';
import { requireAuth } from '../../middleware/requireAuth';

const router = Router();
router.use(cookieParser());

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.get('/me', requireAuth, me);

export default router;
