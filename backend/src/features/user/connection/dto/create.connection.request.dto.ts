import { IsString, IsEmail, IsNotEmpty, MinLength, IsEnum, IsUUID } from 'class-validator';

export class ConnectionRequestCreateDto {
    @IsUUID()
    @IsNotEmpty()
    connected_user_uuid: string;
}