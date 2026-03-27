import { IsNotEmpty, IsUUID } from 'class-validator';

export class ChangePostInteractionDto {
    @IsUUID()
    @IsNotEmpty()
    post_uuid: string;
}