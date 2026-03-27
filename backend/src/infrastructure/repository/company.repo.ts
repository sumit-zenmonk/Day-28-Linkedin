import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { CompanyEntity } from "src/domain/entities/company.entity";

@Injectable()
export class CompanyRepository extends Repository<CompanyEntity> {
    constructor(private readonly dataSource: DataSource) {
        super(CompanyEntity, dataSource.createEntityManager());
    }

    async createCompany(data: Partial<CompanyEntity>) {
        const company = this.create(data);
        return await this.save(company);
    }

    async findByUserUuid(user_uuid: string) {
        return await this.findOne({
            where: { user_uuid },
            select: {
                uuid: true,
                user_uuid: true,
                name: true,
                email: true,
                mobile_number: true,
                industry: true,
                description: true,
                location: true,
                created_at: true,
                updated_at: true,

                user: {
                    uuid: true,
                    name: true,
                    email: true,
                    role: true,
                    created_at: true
                },

                employees: {
                    uuid: true,
                    user_uuid: true,
                    created_at: true
                },

                jobs: {
                    uuid: true,
                    position: true,
                    location: true,
                    role: true,
                    min_salary: true,
                    max_salary: true,
                    created_at: true
                }
            },
            relations: {
                user: true,
                employees: true,
                jobs: true
            }
        });
    }

    async updateCompany(user_uuid: string, data: Partial<CompanyEntity>) {
        await this.update({ user_uuid }, data);
        return this.findByUserUuid(user_uuid);
    }

    async deleteCompany(user_uuid: string) {
        return await this.softDelete({ user_uuid });
    }

    async getCompanyEmployee(company_uuid: string, offset?: number, limit?: number) {
        const [data, total] = await this.findAndCount({
            where: {
                uuid: company_uuid
            },
            relations: {
                employees: {
                    user: {
                        education_histories: true,
                        employment_histories: true,
                        profile: {
                            profile_img: true,
                        }
                    }
                },
            },
            select: {
                uuid: true,
                name: true,
                email: true,
                mobile_number: true,
                industry: true,
                description: true,
                location: true,
                created_at: true,
                employees: {
                    uuid: true,
                    user_uuid: true,
                    created_at: true,
                    user: {
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
                        employment_histories: {
                            uuid: true,
                            company_name: true,
                            start_date: true,
                            end_date: true,
                        },
                        education_histories: {
                            uuid: true,
                            school_name: true,
                            start_date: true,
                            end_date: true,
                        }
                    }
                }
            },
            order: {
                created_at: "DESC",
            },
            skip: offset || Number(process.env.page_offset) || 0,
            take: limit || Number(process.env.page_limit) || 10,
        });

        return { data, total };
    }
}