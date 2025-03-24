import { z } from 'zod';

export const registerSchema = z.object({
    username: z.string()
    .min(3, { message: 'Username must be at least 3 characters'})
    .max(30, { message: 'Username cannot exceed 30 characters'})
    .regex(/^[a-zA-Z0-9_-]+$/, {
        message: 'Username can only contain letters, number, underscores and hyphens'
    }),
    email: z.string()
    .email({ message: 'Invalid email address'}),
    password: z.string()
    .min(6, { message: 'Password must be at least 6 characters'})
    .max(100, { message: 'Password too long'})
});

export const loginSchema = z.object({
    email: z.string().email({ message: 'Invalid email address' }).optional(),
    username: z.string()
      .min(3, { message: 'Username must be at least 3 characters' })
      .max(30, { message: 'Username cannot exceed 30 characters' })
      .regex(/^[a-zA-Z0-9_-]+$/, { 
        message: 'Username can only contain letters, numbers, underscores and hyphens' 
      }).optional(),
    password: z.string()
      .min(1, { message: 'Password is required' })
  }).refine((data) => data.email || data.username, {
    message: 'Either email or username must be provided'
});