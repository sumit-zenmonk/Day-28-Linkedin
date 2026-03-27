import { Module } from "@nestjs/common";
import { UserRepository } from "src/infrastructure/repository/user.repo";
import { PostController } from "./post.controller";
import { PostService } from "./post.service";
import { PostRepository } from "src/infrastructure/repository/post.repo";
import { ImageRepository } from "src/infrastructure/repository/image.repo";
import { PostInteractionRepository } from "src/infrastructure/repository/post.interaction.repo";

@Module({
    imports: [],
    controllers: [PostController],
    providers: [UserRepository, PostService, PostRepository, ImageRepository, PostInteractionRepository],
    exports: [PostModule],
})

export class PostModule { }