import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class ChangePostInteractionDto {
    @IsUUID()
    @IsNotEmpty()
    post_uuid: string;

    @IsString()
    @IsOptional()
    content?: string;
}