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

    async findConnection(user_uuid: string, connected_user_uuid: string) {
        return await this.findOne({
            where: {
                user_uuid: user_uuid,
                connected_user_uuid: connected_user_uuid
            }
        });
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

                connected_user: {
                    uuid: true,
                    name: true,
                    email: true,
                    role: true,
                    profile: {
                        uuid: true,
                        bio: true,
                        mobile_number: true,
                        profile_img: {
                            uuid: true,
                            image_url: true,
                        }
                    },
                    education_histories: {
                        uuid: true,
                        school_name: true,
                        school_url: true,
                        start_date: true,
                        end_date: true,
                        specialization: true,
                        description: true,
                    },

                    employment_histories: {
                        uuid: true,
                        company_name: true,
                        company_url: true,
                        start_date: true,
                        end_date: true,
                        description: true,
                    },
                }
            },
            relations: {
                connected_user: {
                    profile: {
                        profile_img: true
                    },
                    education_histories: true,
                    employment_histories: true,
                }
            },
            skip: offset || Number(process.env.page_offset) || 0,
            take: limit || Number(process.env.page_limit) || 10
        });

        return { data, total };
    }
}
