import { z } from 'zod';

export const LoginAuthSchema = z.object({
    email: z.string().email({ message: 'Email inválido' }),
    password: z.string().min(6, { message: 'A senha deve ter pelo menos 6 caracteres' }),
});

export const RegisterAuthSchema = z.object({
    name: z.string({ required_error: 'O nome é obrigatório' }),
    email: z.string().email({ message: 'Email inválido' }),
    password: z.string().min(6, { message: 'A senha deve ter pelo menos 6 caracteres' }),
});

export const SocialAuthSchema = z.object({
    email: z.string().email({ message: 'Email inválido' }),
    name: z.string({ required_error: 'O nome é obrigatório' }),
    social_login: z.string({ required_error: 'Campo social é obrigatório' }),
});
