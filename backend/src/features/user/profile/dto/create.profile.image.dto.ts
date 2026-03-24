import { IsNotEmpty, IsString, IsUUID, IsOptional } from "class-validator";

export class CreateProfileImageDto {
    @IsString()
    @IsNotEmpty()
    image_url: string;
}