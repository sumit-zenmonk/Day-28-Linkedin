import { IsString, IsEmail, IsNotEmpty, MinLength, IsEnum, IsUUID } from 'class-validator';
import { ConnectionStatusEnum } from 'src/domain/enums/connection';

export class ConnectionCreateDto {
    @IsUUID()
    @IsNotEmpty()
    request_uuid: string;

    // @IsEnum(ConnectionStatusEnum)
    // status: ConnectionStatusEnum.ACTIVE;
}