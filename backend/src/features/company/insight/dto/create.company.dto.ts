import { IsEmail, IsNotEmpty, IsOptional, IsString, IsUUID, Length } from 'class-validator';

export class CreateCompanyDto {
    @IsString()
    @IsNotEmpty()
    @Length(2, 100)
    name: string;

    @IsEmail()
    email: string;

    @IsString()
    @IsNotEmpty()
    @Length(10, 15)
    mobile_number: string;

    @IsString()
    @IsNotEmpty()
    industry: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsString()
    @IsNotEmpty()
    location: string;
}