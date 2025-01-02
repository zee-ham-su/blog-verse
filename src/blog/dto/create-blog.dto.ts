import { IsString, IsArray, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateBlogDto {
    @IsString()
    @IsNotEmpty()
    readonly title: string;

    @IsString()
    @IsNotEmpty()
    readonly content: string;

    @IsString()
    @IsNotEmpty()
    readonly author: string;

    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    readonly tags?: string[];
}