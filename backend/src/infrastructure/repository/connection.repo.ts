import { Injectable } from "@nestjs/common";
import { ConnectionEntity } from "src/domain/entities/user.connection.entity";
import { DataSource, Repository } from "typeorm";

@Injectable()
export class ConnectionRepository extends Repository<ConnectionEntity> {
    constructor(private readonly dataSource: DataSource) {
        super(ConnectionEntity, dataSource.createEntityManager());
    }

    async createConnection(data: Partial<ConnectionEntity>) {
        const connection = this.create(data);
        return await this.save(connection);
    }

    async getConnections(user_uuid: string, offset?: number, limit?: number) {
        const [data, total] = await this.findAndCount({
            where: {
                user_uuid: user_uuid
            },
            select: {
                uuid: true,
                user_uuid: true,
                connected_user_uuid: true,
                status: true,
            },
            skip: offset || Number(process.env.page_offset) || 0,
            take: limit || Number(process.env.page_limit) || 10
        });

        return { data, total };
    }
}
