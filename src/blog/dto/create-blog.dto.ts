import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsArray, IsOptional } from 'class-validator';

export class CreateBlogDto {
    @ApiProperty({ description: 'The title of the blog Post', example: 'My first blog post' })
    @IsString()
    @IsNotEmpty()
    readonly title: string;

    @ApiProperty({ description: 'The content of the blog Post (supports large text)', example: 'This is a very long content for my blog post...' })
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

    @ApiProperty({ description: 'The media associated with the blog Post (images/videos)', example: ['https://example.com/image1.jpg', 'https://example.com/video1.mp4'] })
    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    readonly media?: string[];

    @ApiProperty({ description: 'The slug of the blog', example: 'my-first-blog' })
    @IsString()
    @IsNotEmpty()
    readonly slug: string;
}