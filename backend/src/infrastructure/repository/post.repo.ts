import { Injectable } from "@nestjs/common";
import { PostEntity } from "src/domain/entities/posts.entity";
import { ConnectionEntity } from "src/domain/entities/user.connection.entity";
import { ConnectionStatusEnum } from "src/domain/enums/connection.status";
import { DataSource, In, Repository } from "typeorm";

@Injectable()
export class PostRepository extends Repository<PostEntity> {
    constructor(private readonly dataSource: DataSource) {
        super(PostEntity, dataSource.createEntityManager());
    }

    async CreateUserPost(data: Partial<PostEntity>) {
        const post = this.create(data);
        return await this.save(post);
    }

    async getUserPost(post_uuid: string, user_uuid: string) {
        return await this.findOne({
            where: {
                uuid: post_uuid,
                user_uuid: user_uuid
            },
            select: {
                uuid: true,
                content: true,
                created_at: true,
                user_uuid: true,
                images: {
                    uuid: true,
                    image_url: true,
                    type: true,
                },
                user: {
                    uuid: true,
                    name: true,
                    email: true,
                    profile: {
                        bio: true,
                        mobile_number: true,
                        profile_img: {
                            uuid: true,
                            image_url: true,
                            type: true,
                        }
                    }
                }
            },
            relations: {
                images: true,
                user: {
                    profile: true
                },
            }
        });
    }

    async deletePost(post_uuid: string) {
        return await this.softDelete({ uuid: post_uuid });
    }

    async getUserPosts(user_uuid: string, offset?: number, limit?: number) {
        const [data, total] = await this.findAndCount({
            where: {
                user_uuid: user_uuid
            },
            select: {
                uuid: true,
                content: true,
                created_at: true,
                user_uuid: true,
                images: {
                    uuid: true,
                    image_url: true,
                    type: true,
                },
                user: {
                    uuid: true,
                    name: true,
                    email: true,
                    profile: {
                        bio: true,
                        mobile_number: true,
                        profile_img: {
                            uuid: true,
                            image_url: true,
                            type: true,
                        }
                    }
                }
            },
            relations: {
                images: true,
                user: {
                    profile: true
                },
            },
            skip: offset || Number(process.env.page_offset) || 0,
            take: limit || Number(process.env.page_limit) || 10
        });

        return { data, total };
    }

    async getConnectionsPosts(user_uuid: string, offset?: number, limit?: number) {
        // get connections
        const connections = await this.dataSource
            .getRepository(ConnectionEntity)
            .find({
                where: [
                    { user_uuid: user_uuid, status: ConnectionStatusEnum.ACTIVE },
                    { connected_user_uuid: user_uuid, status: ConnectionStatusEnum.ACTIVE }
                ]
            });

        // extract connected user ids
        const connectionIds = connections.map(conn =>
            conn.user_uuid === user_uuid
                ? conn.connected_user_uuid
                : conn.user_uuid
        );

        // get posts of connections not mine
        const [data, total] = await this.findAndCount({
            where: {
                user_uuid: In(connectionIds.length ? connectionIds : ['']),
            },
            select: {
                uuid: true,
                content: true,
                created_at: true,
                user_uuid: true,
                images: {
                    uuid: true,
                    image_url: true,
                    type: true,
                },
                user: {
                    uuid: true,
                    name: true,
                    email: true,
                    profile: {
                        bio: true,
                        mobile_number: true,
                        profile_img: {
                            uuid: true,
                            image_url: true,
                            type: true,
                        }
                    }
                }
            },
            relations: {
                images: true,
                user: {
                    profile: true
                },
            },
            skip: offset || Number(process.env.page_offset) || 0,
            take: limit || Number(process.env.page_limit) || 10,
            order: {
                created_at: 'DESC'
            }
        });

        return { data, total };
    }
}
