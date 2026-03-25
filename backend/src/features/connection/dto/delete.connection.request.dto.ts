import { IsString, IsEmail, IsNotEmpty, MinLength, IsEnum, IsUUID } from 'class-validator';

export class ConnectionRequestDeleteDto {
    @IsUUID()
    @IsNotEmpty()
    uuid: string;
}