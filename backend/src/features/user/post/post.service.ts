import { BadRequestException, Injectable } from "@nestjs/common";
import { PostRepository } from "src/infrastructure/repository/post.repo";
import { CreatePostDto } from "./dto/create.post.dto";
import { UserEntity } from "src/domain/entities/user.entity";
import { ImageRepository } from "src/infrastructure/repository/image.repo";
import { ImageTypeEnum } from "src/domain/enums/img.";
import { ChangePostInteractionDto } from "./dto/change.post.interaction.dto";
import { PostInteractionRepository } from "src/infrastructure/repository/post.interaction.repo";
import { CommentCreateDto } from "./dto/comment.create.dto";
import { CommentRepository } from "src/infrastructure/repository/comment.repo";

@Injectable()
export class PostService {
    constructor(
        private readonly postRepo: PostRepository,
        private readonly imageRepo: ImageRepository,
        private readonly postInteractionRepo: PostInteractionRepository,
        private readonly commentRepo: CommentRepository,
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

    async changePostInteraction(user: UserEntity, body: ChangePostInteractionDto) {
        const isExists = await this.postInteractionRepo.findByUserUuidAndPostUuid(user.uuid, body.post_uuid);

        if (!body.content || body.content.trim() === '') {
            if (isExists) {
                await this.postInteractionRepo.deletePostInteraction(isExists.uuid);
            }
            return { message: "Reaction removed" };
        }

        if (isExists) {
            isExists.content = body.content;
            await this.postInteractionRepo.save(isExists);
            return { message: "Reaction updated" };
        }

        await this.postInteractionRepo.createPostInteraction({
            user_uuid: user.uuid,
            post_uuid: body.post_uuid,
            content: body.content
        });

        return { message: "Reaction added" };
    }

    async createPostComment(body: CommentCreateDto, user: UserEntity) {
        return await this.commentRepo.createComment(body, user.uuid);
    }

    async getPostComments(post_uuid: string) {
        return await this.commentRepo.getAllComments(post_uuid);
    }
}