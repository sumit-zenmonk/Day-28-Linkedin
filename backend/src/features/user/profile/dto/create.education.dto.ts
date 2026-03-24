import { IsNotEmpty, IsString, IsUUID, IsOptional, IsDate, IsDateString } from "class-validator";

export class CreateEducationDto {
    @IsNotEmpty()
    @IsString()
    school_name: string;

    @IsOptional()
    @IsString()
    school_url?: string;

    @IsNotEmpty()
    @IsDateString()
    start_date: Date;

    @IsOptional()
    @IsDateString()
    end_date?: Date;

    @IsOptional()
    @IsString()
    specialization?: string;

    @IsOptional()
    @IsString()
    description?: string;
}