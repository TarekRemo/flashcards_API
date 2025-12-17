import {z} from 'zod';

export const registerSchema = z.object({
    email: z.email(),
    firstName: z.string().min(3).max(30),
    lastName: z.string().min(3).max(30),
    password: z.string().min(8).max(255)
});


export const loginSchema = z.object({
    email: z.email(),
    password: z.string().min(8).max(255)
});
