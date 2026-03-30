import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MessageEntity } from "src/domain/entities/message.entity";
import { MessageRepository } from "src/infrastructure/repository/message.repo";
import { ConnectionRepository } from "src/infrastructure/repository/connection.repo";
import { UserRepository } from "src/infrastructure/repository/user.repo";
import { ChatService } from "./chat.service";
import { ChatController } from "./chat.controller";

@Module({
    imports: [TypeOrmModule.forFeature([MessageEntity])],
    controllers: [ChatController],
    providers: [MessageRepository, ConnectionRepository, UserRepository, ChatService],
    exports: [ChatService]
})
export class ChatModule { }
