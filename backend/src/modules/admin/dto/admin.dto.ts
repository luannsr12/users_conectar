// user.dto.ts
import { createZodDto } from 'nestjs-zod';
import { CreateUserSchema, UpdateUserSchema } from '../../../common/schema/user.schema';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// DTOs de validação (Zod)
export class CreateUserDto extends createZodDto(CreateUserSchema) { }
export class UpdateUserDto extends createZodDto(UpdateUserSchema) { }

// DTOs para Swagger
export class CreateUserSwaggerDto {
    @ApiProperty({ example: 'Daenerys Targaryen' })
    name: string;

    @ApiProperty({ example: 'daenerys@example.com' })
    email: string;

    @ApiProperty({ example: '123456', minLength: 6 })
    password: string;

    @ApiPropertyOptional({ enum: ['user', 'admin'] })
    role?: 'user' | 'admin';
}

export class UpdateUserSwaggerDto {
    @ApiPropertyOptional({ example: 'Daenerys Targaryen' })
    name?: string;

    @ApiPropertyOptional({ example: 'daenerys@example.com' })
    email?: string;

    @ApiPropertyOptional({ example: '123456', minLength: 6 })
    password?: string;

    @ApiPropertyOptional({ enum: ['user', ' admin'] })
    role?: 'user' | 'admin';
}
