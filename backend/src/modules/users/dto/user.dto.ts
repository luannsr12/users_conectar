// user.dto.ts
import { createZodDto } from 'nestjs-zod';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { CreateUserSchema, UpdateUserSchema } from '../../../common/schema/user.schema';

// DTO para validação real com Zod
export class CreateUserDto extends createZodDto(CreateUserSchema) { }
export class UpdateUserDto extends createZodDto(UpdateUserSchema) { }


export class UpdateUserSwaggerDto {
    @ApiPropertyOptional({ example: 'Daenerys Targaryen' })
    name?: string;

    @ApiPropertyOptional({ example: 'daenerys@example.com' })
    email?: string;

    @ApiPropertyOptional({ example: '123456', minLength: 6 })
    password?: string;
}
