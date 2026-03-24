import { BadRequestException, Controller, Post, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { FilesInterceptor } from "@nestjs/platform-express";
import { FileUploadService } from "src/infrastructure/file-upload/upload.service";

@Controller('upload')
export default class UploadController {
    constructor(private readonly fileUploadService: FileUploadService) { }

    //image route handler
    @Post('image')
    @UseInterceptors(
        FilesInterceptor('imageUrl', 1, {
            fileFilter: (req, file, cb) => {
                if (!file.mimetype.includes('image')) {
                    return cb(new BadRequestException('Only images allowed'), false);
                }
                cb(null, true);
            },
        }),
    )
    async uploadImage(@UploadedFiles() files: Express.Multer.File[]) {
        const storedFiles = this.fileUploadService.handleUpload(files, 'image', 1);
        const image_urls = storedFiles.files;
        return {
            image_urls,
            message: "File uploaded successfully"
        };
    }

    //video route hndler
    @Post('video')
    @UseInterceptors(
        FilesInterceptor('videoUrl', 2, {
            fileFilter: (req, file, cb) => {
                if (!file.mimetype.includes('video')) {
                    return cb(new BadRequestException('Only videos allowed'), false);
                }
                cb(null, true);
            },
        }),
    )
    async uploadVideo(@UploadedFiles() files: Express.Multer.File[]) {
        const storedFiles = this.fileUploadService.handleUpload(files, 'video', 2);
        const image_urls = storedFiles.files;
        return {
            image_urls,
            message: "File uploaded successfully"
        };
    }
}