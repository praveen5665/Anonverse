import express from 'express';
import { register, login, getCurrentUser, getUserByUsername, updateUserProfile, getUserStats } from '../controllers/auth.js';
import { validate } from '../middleware/validate.js';
import { registerSchema, loginSchema } from '../schemas/userSchema.js';
import { auth } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.get('/me', auth, getCurrentUser);
router.get('/user/:username', getUserByUsername);
router.put('/user/profile', auth, upload.user.single('avatar'), updateUserProfile);
router.get('/user/:username/stats', getUserStats);

export default router;