import { IsNotEmpty, IsString, IsUUID, IsOptional } from "class-validator";

export class UpdateProfileDto {
    @IsUUID()
    @IsNotEmpty()
    user_uuid: string;

    @IsOptional()
    @IsString()
    bio?: string;

    @IsOptional()
    @IsString()
    mobile_number?: string;
}