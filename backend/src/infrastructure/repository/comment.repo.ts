import { Injectable } from "@nestjs/common";
import { CommentEntity } from "src/domain/entities/comment.entity";
import { CommentCreateDto } from "src/features/user/post/dto/comment.create.dto";
import { DataSource, Repository } from "typeorm";

@Injectable()
export class CommentRepository extends Repository<CommentEntity> {
    constructor(private readonly dataSource: DataSource) {
        super(CommentEntity, dataSource.createEntityManager());
    }

    async createComment(body: CommentCreateDto, user_uuid: string) {
        const Comment = await this.create({
            ...body,
            user_uuid: user_uuid
        });

        const comment = await this.save(Comment);

        return await this.getcomment(comment.uuid)
    }

    async getcomment(uuid: string) {
        return await this.find({
            where: {
                uuid
            }
            , relations: {
                user: true,
                post:true
            }
            , select: {
                uuid: true,
                parent_uuid: true,
                comment: true,
                post_uuid: true,
                user: {
                    uuid: true,
                    name: true,
                    email: true,
                },
                post: true,
                user_uuid: true,
                created_at: true
            }
        })
    }

    async getAllComments(post_uuid: string) {
        return await this.find({
            where: {
                post_uuid: post_uuid
            }
            , relations: {
                user: true,
                post:true
            }
            , select: {
                uuid: true,
                parent_uuid: true,
                comment: true,
                post_uuid: true,
                user: {
                    uuid: true,
                    name: true,
                    email: true,
                },
                post: true,
                user_uuid: true,
                created_at: true
            }
        })
    }
}