import { Body, Controller, Get, Param, Post, Query, Req } from "@nestjs/common";
import { ChatService } from "./chat.service";
import type { Request } from "express";
import { UserEntity } from "src/domain/entities/user.entity";

@Controller('chat')
export class ChatController {
    constructor(private readonly chatService: ChatService) { }

    @Get('messages/:friendUuid')
    async getMessages(@Req() req: Request, @Param('friendUuid') friendUuid: string, @Query('page') page: string, @Query('limit') limit: string,) {
        return await this.chatService.getMessages(req.user, friendUuid, parseInt(page) || 1, parseInt(limit) || 50);
    }

    @Post('send')
    async sendMessage(@Req() req: Request, @Body() body: { receiver_uuid: string; content: string }) {
        return await this.chatService.saveMessage(req.user.uuid, body.receiver_uuid, body.content);
    }
}
