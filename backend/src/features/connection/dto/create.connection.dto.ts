import { IsString, IsEmail, IsNotEmpty, MinLength, IsEnum, IsUUID } from 'class-validator';
import { ConnectionStatusEnum } from 'src/domain/enums/connection.status';

export class ConnectionCreateDto {
    @IsUUID()
    @IsNotEmpty()
    request_uuid: string;

    // @IsEnum(ConnectionStatusEnum)
    // status: ConnectionStatusEnum.ACTIVE;
}