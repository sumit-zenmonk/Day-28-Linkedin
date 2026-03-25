import { Injectable } from "@nestjs/common";
import { ConnectionRequestEntity } from "src/domain/entities/user.connection.request.entity";
import { DataSource, Repository } from "typeorm";

@Injectable()
export class ConnectionRequestRepository extends Repository<ConnectionRequestEntity> {
    constructor(private readonly dataSource: DataSource) {
        super(ConnectionRequestEntity, dataSource.createEntityManager());
    }

    async createConnectionRequest(data: Partial<ConnectionRequestEntity>) {
        const connectionRequest = this.create(data);
        return await this.save(connectionRequest);
    }

    async findConnectionRequest(user_uuid: string, connected_user_uuid: string) {
        return await this.findOne({
            where: [
                { user_uuid: user_uuid, connected_user_uuid: connected_user_uuid },
                { user_uuid: connected_user_uuid, connected_user_uuid: user_uuid }
            ]
        });
    }

    async getConnectionRequests(user_uuid: string, offset?: number, limit?: number) {
        const [data, total] = await this.findAndCount({
            where: {
                user_uuid: user_uuid
            },
            select: {
                uuid: true,
                user_uuid: true,
                connected_user_uuid: true,
                connected_user: {
                    uuid: true,
                    name: true,
                    email: true,

                    profile: {
                        uuid: true,
                        bio: true,
                        mobile_number: true,

                        profile_img: {
                            uuid: true,
                            image_url: true,
                        }
                    }
                }
            },
            relations: {
                connected_user: {
                    profile: {
                        profile_img: true
                    }
                }
            },
            skip: offset || Number(process.env.page_offset) || 0,
            take: limit || Number(process.env.page_limit) || 10
        })

        return { data, total };
    }

    async getConnectionRequestsInvite(user_uuid: string, offset?: number, limit?: number) {
        const [data, total] = await this.findAndCount({
            where: {
                connected_user_uuid: user_uuid,
            },
            select: {
                uuid: true,
                user_uuid: true,
                connected_user_uuid: true,
                connected_user: {
                    uuid: true,
                    name: true,
                    email: true,

                    profile: {
                        uuid: true,
                        bio: true,
                        mobile_number: true,

                        profile_img: {
                            uuid: true,
                            image_url: true,
                        }
                    }
                }
            },
            relations: {
                connected_user: {
                    profile: {
                        profile_img: true
                    }
                }
            },
            skip: offset || Number(process.env.page_offset) || 0,
            take: limit || Number(process.env.page_limit) || 10
        })

        return { data, total };
    }

    async deleteConnectionRequest(uuid: string) {
        return await this.softDelete(uuid);
    }

    async findConnectionRequestByUUID(uuid: string) {
        return await this.findOne({
            where: {
                uuid: uuid
            }
        })
    }
}