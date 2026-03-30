import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { MessageEntity } from "src/domain/entities/message.entity";

@Injectable()
export class MessageRepository extends Repository<MessageEntity> {
    constructor(private dataSource: DataSource) {
        super(MessageEntity, dataSource.createEntityManager());
    }

    async saveMessage(data: Partial<MessageEntity>) {
        const message = this.create(data);
        return await this.save(message);
    }

    async getMessagesBetweenUsers(user1: string, user2: string, offset: number, take: number) {
        const [data, total] = await this.findAndCount({
            where: [
                { sender_uuid: user1, receiver_uuid: user2 },
                { sender_uuid: user2, receiver_uuid: user1 }
            ],
            order: { created_at: 'ASC' },
            skip: offset,
            take: take,
            relations: ['sender', 'receiver']
        });

        return { data, total };
    }
}
