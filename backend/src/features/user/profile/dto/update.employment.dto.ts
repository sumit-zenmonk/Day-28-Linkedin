import { IsString, IsOptional, IsDateString, IsUUID } from "class-validator";

export class UpdateEmploymentDto {
    @IsUUID()
    uuid: string;

    @IsOptional()
    @IsString()
    company_name?: string;

    @IsOptional()
    @IsString()
    company_url?: string;

    @IsDateString()
    start_date?: string;

    @IsOptional()
    @IsDateString()
    end_date?: string;

    @IsOptional()
    @IsString()
    description?: string;
}