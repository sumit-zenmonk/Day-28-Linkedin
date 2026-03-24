import { IsString, IsOptional, IsDateString, IsDate, IsNotEmpty } from "class-validator";

export class CreateEmploymentDto {
    @IsNotEmpty()
    @IsString()
    company_name: string;

    @IsOptional()
    @IsString()
    company_url?: string;

    @IsNotEmpty()
    @IsDateString()
    start_date: Date;

    @IsOptional()
    @IsDateString()
    end_date?: Date;

    @IsOptional()
    @IsString()
    description?: string;
}