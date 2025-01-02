import { IsString, IsEmail, IsNotEmpty, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';


export class CreateUserDto {
    @ApiProperty({ description: 'The username of the user', example: 'john_doe' })
    @IsString()
    @IsNotEmpty()
    readonly username: string;

    @ApiProperty({ description: 'The email of the user', example: 'john.doe@example.com' })
    @IsEmail()
    @IsNotEmpty()
    readonly email: string;

    @ApiProperty({ description: 'The password of the user', example: 'password' })
    @IsString()
    @IsNotEmpty()
    readonly password: string;

    @ApiProperty({ description: 'The role of the user', example: 'reader', enum: ['reader', 'author', 'admin'] })
    @IsString()
    @IsNotEmpty()
    readonly role: string;

    @ApiProperty({ description: 'The saved blogs of the user', example: ['blog1', 'blog2'] })
    @IsString({ each: true })
    @IsArray()
    readonly savedBlogs: string[];
}
