import { BadRequestException, Injectable } from "@nestjs/common";
import { PostRepository } from "src/infrastructure/repository/post.repo";
import { CreatePostDto } from "./dto/create.post.dto";
import { UserEntity } from "src/domain/entities/user.entity";
import { ImageRepository } from "src/infrastructure/repository/image.repo";
import { ImageTypeEnum } from "src/domain/enums/img.type";

@Injectable()
export class PostService {
    constructor(
        private readonly postRepo: PostRepository,
        private readonly imageRepo: ImageRepository,
    ) { }

    async CreateUserPost(user: UserEntity, body: CreatePostDto) {
        // post creation
        const post = await this.postRepo.CreateUserPost({ content: body.content, user_uuid: user.uuid });

        //image attaching to post
        if (body.images?.length) {
            await Promise.all(
                body.images.map((image) =>
                    this.imageRepo.upsertPostImage({
                        post_uuid: post.uuid,
                        image_url: image.image_url,
                        type: ImageTypeEnum.POST,
                        user_uuid: user.uuid
                    })
                )
            );
        }

        const data = await this.postRepo.getUserPost(post.uuid, user.uuid);
        return {
            data,
            message: "Post Created"
        }
    }

    async getUserPost(post_id: string, user: UserEntity) {
        const post = await this.postRepo.getUserPost(post_id, user.uuid);

        if (!post) {
            throw new BadRequestException('Post not found');
        }

        return {
            message: "Post fetched",
            data: post
        };
    }

    async deletePost(post_id: string, user: UserEntity) {
        const post = await this.postRepo.getUserPost(post_id, user.uuid);

        if (!post) {
            throw new BadRequestException('Post not found');
        }

        await this.postRepo.deletePost(post_id);
        return {
            message: "Post deleted successfully"
        };
    }

    async getUserPosts(user: UserEntity, page?: number, limit?: number) {
        const currentPage = page || 1;
        const take = limit || 10;
        const offset = (currentPage - 1) * take;

        const { data, total } = await this.postRepo.getUserPosts(user.uuid, offset, take);

        return {
            connectionsRequests: data,
            totalDocuments: total,
            limit: take,
            offset,
            totalPages: Math.ceil(total / take),
            message: "Request fetched Success"
        }
    }
}