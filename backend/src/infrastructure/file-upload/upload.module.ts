import { Global, Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as fs from 'fs';
import * as path from 'path';
import { FileUploadService } from './upload.service';

export const multerconfig = {
    storage: diskStorage({
        destination: (req, file, cb) => {
            const uploadPath = path.join(process.cwd(), 'uploads');
            // Create folfer if not exists
            if (!fs.existsSync(uploadPath)) {
                fs.mkdirSync(uploadPath, { recursive: true });
            }
            cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
            const filename = `${Date.now()}-${file.originalname}`;
            cb(null, filename);
        },
    }),
};

@Global()
@Module({
    imports: [MulterModule.register(multerconfig)],
    providers: [FileUploadService],
    exports: [FileUploadService, MulterModule]
})
export class FileUploadModule { }