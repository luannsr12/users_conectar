// src/auth/dto/social-auth.dto.ts
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SocialAuthDto {
    @IsEmail()
    email: string;

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    social: string;
}
