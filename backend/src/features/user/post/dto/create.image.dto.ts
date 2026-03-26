import { IsUrl } from "class-validator";

export class CreatePostImageDto {
    @IsUrl()
    image_url: string;
}