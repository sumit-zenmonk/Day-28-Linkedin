import { IsNotEmpty, IsString, IsUUID, IsOptional } from "class-validator";

export class CreateProfileDto {
    @IsOptional()
    @IsString()
    bio?: string;

    @IsOptional()
    @IsString()
    mobile_number?: string;
}