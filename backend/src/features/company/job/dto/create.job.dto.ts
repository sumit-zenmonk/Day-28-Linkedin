import { IsString, IsUUID, IsInt, Min, IsArray, ArrayNotEmpty, IsOptional } from 'class-validator';

export class CreateJobDto {
    @IsString()
    position: string;

    @IsString()
    location: string;

    @IsString()
    role: string;

    @IsInt()
    @Min(0)
    min_salary: number;

    @IsInt()
    @Min(0)
    max_salary: number;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    tags?: string[];
}