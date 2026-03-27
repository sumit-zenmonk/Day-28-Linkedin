import { Injectable } from "@nestjs/common";
import { PostInteractionEntity } from "src/domain/entities/post.interaction.entity";
import { DataSource, Repository } from "typeorm";

@Injectable()
export class PostInteractionRepository extends Repository<PostInteractionEntity> {
    constructor(private readonly dataSource: DataSource) {
        super(PostInteractionEntity, dataSource.createEntityManager());
    }

    async createPostInteraction(data: Partial<PostInteractionEntity>) {
        const post_interaction = this.create(data);
        return await this.save(post_interaction);
    }

    async findByUserUuidAndPostUuid(user_uuid: string, post_uuid: string) {
        return await this.findOne({
            where: {
                user_uuid,
                post_uuid
            }
        });
    }

    async deletePostInteraction(uuid: string) {
        return await this.softDelete({ uuid });
    }
}