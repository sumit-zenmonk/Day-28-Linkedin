import { IsString, IsNotEmpty, MinLength, IsUUID, IsDateString, IsOptional, } from 'class-validator';

export class CommentCreateDto {
    @IsUUID()
    @IsNotEmpty()
    post_uuid: string;

    @IsUUID()
    @IsOptional()
    parent_uuid: string;

    @IsString()
    @IsNotEmpty()
    comment: string;
}