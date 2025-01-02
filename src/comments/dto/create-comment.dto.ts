import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';


export class CreateCommentDto {
    @ApiProperty({ description: 'The content of the comment', example: 'This is a comment' })
    @IsString()
    @IsNotEmpty()
    content: string;

    @ApiProperty({ description: 'The id of the blog post', example: '60f7b3b3b3b3b3b3b3b3b3b3' })
    @IsString()
    @IsNotEmpty()
    blog: string;

    @ApiProperty({ description: 'The id of the author', example: '60f7b3b3b3b3b3b3b3b3b3' })
    @IsString()
    @IsNotEmpty()
    author: string;
}
