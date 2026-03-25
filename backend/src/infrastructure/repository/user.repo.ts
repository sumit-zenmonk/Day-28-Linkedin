import { Injectable } from "@nestjs/common";
import { UserEntity } from "src/domain/entities/user.entity";
import { RoleEnum } from "src/domain/enums/user";
import { RegisterDto } from "src/features/Auth/dto/register.dto";
import { DataSource, Not, Repository } from "typeorm";

@Injectable()
export class UserRepository extends Repository<UserEntity> {
    constructor(private readonly dataSource: DataSource) {
        super(UserEntity, dataSource.createEntityManager());
    }

    async register(body: RegisterDto) {
        const user = this.create(body);
        return await this.save(user);
    }

    async findByUuid(uuid: string) {
        const user = await this.find({
            where: {
                uuid: uuid
            },
            select: {
                email: true,
                name: true,
                uuid: true,
                role: true
            }
        });
        return user;
    }

    async findByEmail(email: string) {
        const user = await this.find({
            where: {
                email: email
            },
            select: {
                email: true,
                name: true,
                uuid: true,
                password: true,
                role: true
            }
        });
        return user;
    }

    async findByEmailAndRole(email: string, role: RoleEnum) {
        const user = await this.find({
            where: {
                email: email,
                role: role
            },
            select: {
                email: true,
                name: true,
                uuid: true,
                password: true,
                role: true
            }
        });
        return user;
    }

    async getGlobalConnection(user_uuid: string, offset?: number, limit?: number) {
        const [data, total] = await this.findAndCount({
            where: {
                uuid: Not(user_uuid)
            },
            select: {
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
                        image_url: true
                    }
                },
                employment_histories: {
                    uuid: true,
                    company_name: true,
                    company_url: true,
                    start_date: true,
                    end_date: true,
                    description: true,
                },
                education_histories: {
                    uuid: true,
                    description: true,
                    school_name: true,
                    end_date: true,
                    start_date: true,
                    specialization: true,
                    school_url: true,
                }
            },
            relations: {
                profile: {
                    profile_img: true
                },
                education_histories: true,
                employment_histories: true,
            },
            skip: offset || Number(process.env.page_offset) || 0,
            take: limit || Number(process.env.page_limit) || 10
        });

        return { data, total };
    }
}