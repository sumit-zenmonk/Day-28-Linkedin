import { IsNotEmpty, IsUUID, } from 'class-validator';

export class CreateEmployeeDto {
    @IsUUID()
    @IsNotEmpty()
    application_uuid: string;
}