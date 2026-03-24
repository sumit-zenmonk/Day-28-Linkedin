import { IsString, IsEmail, IsNotEmpty, MinLength, IsEnum, IsUUID } from 'class-validator';
import { ConnectionStatusEnum } from 'src/domain/enums/connection.status';

export class ConnectionCreateDto {
    @IsUUID()
    @IsNotEmpty()
    user_uuid: string;

    @IsUUID()
    @IsNotEmpty()
    connected_user_uuid: string;

    @IsEnum(ConnectionStatusEnum)
    status: ConnectionStatusEnum.PENDING;
}