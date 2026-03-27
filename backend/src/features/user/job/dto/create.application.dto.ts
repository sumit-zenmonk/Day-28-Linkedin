import { IsUUID, IsNotEmpty } from 'class-validator';

export class CreateApplicationDto {
    @IsUUID()
    @IsNotEmpty()
    job_uuid: string;
}