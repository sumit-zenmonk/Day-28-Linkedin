import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";
import type { Request } from "express";
import { Roles } from "src/infrastructure/guard/role/role.decorator";
import { RolesGuard } from "src/infrastructure/guard/role/role.guard";
import { RoleEnum } from "src/domain/enums/user";
import { PostService } from "./post.service";
import { CreatePostDto } from "./dto/create.post.dto";
import { ChangePostInteractionDto } from "./dto/change.post.interaction.dto";

@UseGuards(RolesGuard)
@Roles(RoleEnum.USER)
@Controller('/post')
export class PostController {
    constructor(
        private readonly postService: PostService
    ) { }

    @Post()
    async CreateUserPost(@Req() req: Request, @Body() body: CreatePostDto) {
        return await this.postService.CreateUserPost(req.user, body);
    }

    @Get()
    async getUserPosts(@Req() req, @Query("page") page?: number, @Query("limit") limit?: number,) {
        return await this.postService.getUserPosts(req.user, Number(page), Number(limit));
    }

    @Get('/:post_id')
    async getUserPost(@Req() req: Request, @Param('post_id') post_id: string) {
        return await this.postService.getUserPost(post_id, req.user.uuid);
    }

    @Delete('/:post_id')
    async deletePost(@Req() req: Request, @Param('post_id') post_id: string) {
        return await this.postService.deletePost(post_id, req.user);
    }

    @Post('/interaction')
    async changePostInteraction(@Req() req: Request, @Body() body: ChangePostInteractionDto) {
        return await this.postService.changePostInteraction(req.user, body);
    }
}