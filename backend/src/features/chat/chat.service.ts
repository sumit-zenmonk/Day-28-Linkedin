import { Injectable } from "@nestjs/common";
import { MessageRepository } from "src/infrastructure/repository/message.repo";
import { ConnectionRepository } from "src/infrastructure/repository/connection.repo";
import { UserEntity } from "src/domain/entities/user.entity";
import { SocketService } from "src/infrastructure/socket/socket.service";

@Injectable()
export class ChatService {
    constructor(
        private readonly messageRepo: MessageRepository,
        private readonly connectionRepo: ConnectionRepository,
        private readonly socketService: SocketService,
    ) { }

    async getMessages(user: UserEntity, friendUuid: string, page: number = 1, limit: number = 50) {
        const offset = (page - 1) * limit;
        const { data, total } = await this.messageRepo.getMessagesBetweenUsers(user.uuid, friendUuid, offset, limit);

        return {
            messages: data,
            total,
            page,
            limit,
            message: "Messages fetched successfully"
        };
    }

    async saveMessage(senderUuid: string, receiverUuid: string, content: string) {
        const isUserConnectin = await this.connectionRepo.findConnection(senderUuid, receiverUuid);
        if (!isUserConnectin) {
            throw new Error("Users are not connected");
        }

        const message = await this.messageRepo.saveMessage({
            sender_uuid: senderUuid,
            receiver_uuid: receiverUuid,
            content
        });

        this.socketService.emitToUser(receiverUuid, 'newMessage', message);
        return message;
    }
}
