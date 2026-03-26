import { IsEmail, IsOptional, IsString, IsUUID, Length } from 'class-validator';

export class UpdateCompanyDto {
    @IsString()
    @IsOptional()
    @Length(2, 100)
    name?: string;

    @IsEmail()
    @IsOptional()
    email?: string;

    @IsString()
    @IsOptional()
    @Length(10, 15)
    mobile_number?: string;

    @IsString()
    @IsOptional()
    industry?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsString()
    @IsOptional()
    location?: string;
}