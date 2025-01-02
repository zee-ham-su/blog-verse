import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsArray, IsOptional } from 'class-validator';

export class CreateBlogDto {
    @ApiProperty({ description: 'The title of the blog Post', example: 'My first blog post' })
    @IsString()
    @IsNotEmpty()
    readonly title: string;

    @ApiProperty({ description: 'The content of the blog Post', example: 'This is the content of my first blog post' })
    @IsString()
    @IsNotEmpty()
    readonly content: string;

    @ApiProperty({ description: 'The author of the blog Post', example: 'John Doe' })
    @IsString()
    @IsNotEmpty()
    readonly author: string;

    @ApiProperty({ description: 'The tags associated with the blog Post', example: ['tech', 'programming'] })
    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    readonly tags?: string[];
}