import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { ImageTypeEnum } from "src/domain/enums/img.type";
import { ImageEntity } from "src/domain/entities/images.entity";

@Injectable()
export class ImageRepository extends Repository<ImageEntity> {
    constructor(private readonly dataSource: DataSource) {
        super(ImageEntity, dataSource.createEntityManager());
    }

    async findProfileImage(profile_uuid: string) {
        return this.findOne({
            where: { profile_uuid }
        });
    }

    async upsertProfileImage(data: {
        user_uuid: string;
        profile_uuid: string;
        image_url: string;
    }) {
        let image = await this.findProfileImage(data.profile_uuid);

        if (image) {
            image.image_url = data.image_url;
        } else {
            image = this.create({
                ...data,
                type: ImageTypeEnum.PROFILE,
            });
        }

        return this.save(image);
    }

    async upsertPostImage(data: Partial<ImageEntity>) {
        const postImage = this.create(data);
        return await this.save(postImage);
    }
}