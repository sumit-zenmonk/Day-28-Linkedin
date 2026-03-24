import { BadRequestException, Injectable } from '@nestjs/common';
import { mimeCategoryConfig } from './upload.config';

@Injectable()
export class FileUploadService {
    constructor() { }

    handleUpload(
        files: Express.Multer.File[],
        type: keyof typeof mimeCategoryConfig,
        maxFiles: number = 1,
    ) {
        //throw error if files didnt reach here
        if (!files || files.length === 0) {
            throw new BadRequestException('No file uploaded');
        }
        if (files.length > maxFiles) {
            throw new BadRequestException(
                `Maximum ${maxFiles} files allowed`,
            );
        }

        //Category Choosen
        const config = mimeCategoryConfig[type];

        if (!config) {
            throw new BadRequestException('Invalid upload type');
        }

        //Validate Files acc to Category config
        files.forEach((file) => {
            if (!config.allowed.includes(file.mimetype)) {
                throw new BadRequestException(
                    `Invalid ${type} file type`,
                );
            }

            if (file.size > config.maxSize) {
                throw new BadRequestException(
                    `${type} exceeds size limit`,
                );
            }
        });

        const selfUrl = process.env.SELF_URL;
        //sent success
        return {
            message: `${type} uploaded successfully`,
            files: files.map((f) => ({
                path: `${selfUrl}/uploads/${f.filename}`,
            })),
        };
    }
}