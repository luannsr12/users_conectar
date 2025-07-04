// user.schema.ts
import { z } from 'zod';

export const UserSchema = z.object({
    id: z.string().uuid().optional(),
    name: z.string().min(1),
    email: z.string().email(),
    password: z.string().min(6),
    role: z.enum(['admin', 'user']).optional(),
    social_login: z.string().optional(),
});

export const RegisterSchema = UserSchema.omit({ id: true, role: true });

export const CreateUserSchema = UserSchema.omit({ id: true });

export const LoginSchema = RegisterSchema.pick({ email: true, password: true });

export const UpdateUserSchema = UserSchema.omit({ id: true, role: true }).extend({
    password: z.string().min(6).optional(),
});