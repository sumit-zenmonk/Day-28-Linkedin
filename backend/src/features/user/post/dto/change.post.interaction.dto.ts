import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class ChangePostInteractionDto {
    @IsUUID()
    @IsNotEmpty()
    post_uuid: string;

    @IsString()
    @IsNotEmpty()
    content: string;
}