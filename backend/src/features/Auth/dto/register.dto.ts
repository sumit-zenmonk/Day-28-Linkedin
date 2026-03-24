import { IsString, IsEmail, IsNotEmpty, MinLength, IsEnum } from 'class-validator';
import { RoleEnum } from 'src/domain/enums/user';

export class RegisterDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @MinLength(3)
    password: string;

    @IsEnum(RoleEnum)
    role: RoleEnum.USER;
}