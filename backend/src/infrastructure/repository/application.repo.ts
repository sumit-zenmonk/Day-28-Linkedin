import { Injectable } from "@nestjs/common";
import { ApplicationEntity } from "src/domain/entities/applications.entity";
import { DataSource, Repository } from "typeorm";

@Injectable()
export class ApplicationRepository extends Repository<ApplicationEntity> {
    constructor(private readonly dataSource: DataSource) {
        super(ApplicationEntity, dataSource.createEntityManager());
    }

    async createApplication(data: Partial<ApplicationEntity>) {
        const application = this.create(data);
        return await this.save(application);
    }

    async getAppliedApplication(job_id: string, user_uuid: string) {
        return await this.findOne({
            where: {
                job_uuid: job_id,
                user_uuid: user_uuid
            }
        })
    }

    async getApplicationByUUID(application_id: string) {
        return await this.findOne({
            where: {
                uuid: application_id
            },
            relations: {
                job: {
                    company: true
                },
            }
        })
    }

    async deleteApplication(uuid: string) {
        return await this.softDelete({ uuid });
    }


    async getAppliedJobs(user_uuid: string, offset?: number, limit?: number) {
        const [data, total] = await this.findAndCount({
            where: {
                user_uuid
            },
            relations: {
                job: {
                    company: true,
                    tags: true
                }
            },
            // withDeleted: true,
            order: {
                created_at: "DESC",
            },
            skip: offset || Number(process.env.page_offset) || 0,
            take: limit || Number(process.env.page_limit) || 10,
        });

        return { data, total };
    }

    async getCompanyJobsApplications(company_uuid: string, offset?: number, limit?: number) {
        const [data, total] = await this.findAndCount({
            where: {
                job: {
                    company_uuid
                }
            },
            relations: {
                job: {
                    company: true,
                    tags: true
                },
                user: true
            },
            select: {
                uuid: true,
                created_at: true,
                user: {
                    uuid: true,
                    name: true,
                    email: true,
                },
                job: {
                    uuid: true,
                    position: true,
                    role: true,
                    location: true,
                    min_salary: true,
                    max_salary: true,
                    company: {
                        uuid: true,
                        name: true,
                        industry: true,
                        location: true,
                    },
                    tags: {
                        uuid: true,
                        tag: true,
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

    async getJobApplications(job_uuid: string, offset?: number, limit?: number) {
        const [data, total] = await this.findAndCount({
            where: {
                job_uuid
            },
            relations: {
                job: {
                    company: true,
                    tags: true,

                },
                user: true
            },
            select: {
                uuid: true,
                created_at: true,
                user: {
                    uuid: true,
                    name: true,
                    email: true,
                },
                job: {
                    uuid: true,
                    position: true,
                    role: true,
                    location: true,
                    min_salary: true,
                    max_salary: true,
                    company: {
                        uuid: true,
                        name: true,
                        industry: true,
                        location: true,
                    },
                    tags: {
                        uuid: true,
                        tag: true,
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