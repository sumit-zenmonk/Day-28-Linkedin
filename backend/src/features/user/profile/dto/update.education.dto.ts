import { IsNotEmpty, IsString, IsUUID, IsOptional } from "class-validator";

export class UpdateEducationDto {
    @IsUUID()
    uuid: string;

    @IsOptional()
    @IsString()
    school_name?: string;

    @IsOptional()
    school_url?: string;

    @IsOptional()
    start_date?: Date;

    @IsOptional()
    end_date?: Date;

    @IsOptional()
    specialization?: string;

    @IsOptional()
    description?: string;
}