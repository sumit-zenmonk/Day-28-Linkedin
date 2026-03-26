import { IsString, IsNotEmpty, IsOptional, IsArray, IsEnum, IsUrl } from 'class-validator';
import { CreatePostImageDto } from './create.image.dto';

export class CreatePostDto {
    @IsString()
    @IsNotEmpty()
    content: string;

    @IsOptional()
    @IsArray()
    images?: CreatePostImageDto[];
}