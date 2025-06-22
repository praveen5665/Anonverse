import express from 'express';
import { register, login, getCurrentUser, getUserByUsername } from '../controllers/auth.js';
import { validate } from '../middleware/validate.js';
import { registerSchema, loginSchema } from '../schemas/userSchema.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.get('/me', auth, getCurrentUser);
router.get('/user/:username', getUserByUsername);

export default router;