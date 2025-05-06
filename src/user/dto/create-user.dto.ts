import { IsString, IsEmail, IsNotEmpty, Matches } from 'class-validator';
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

    @ApiProperty({ description: 'The password of the user', example: 'Password123!' })
    @IsString()
    @IsNotEmpty()
    @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
        message: 'Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character',
    })
    readonly password: string;

    @ApiProperty({ description: 'The role of the user', example: 'reader', enum: ['reader', 'author', 'admin'] })
    @IsString()
    @IsNotEmpty()
    readonly role: string;
}
