import { Injectable } from "@nestjs/common";
import { JobEntity } from "src/domain/entities/job.entity";
import { DataSource, Repository } from "typeorm";

@Injectable()
export class JobRepository extends Repository<JobEntity> {
    constructor(private readonly dataSource: DataSource) {
        super(JobEntity, dataSource.createEntityManager());
    }

    async createJob(data: Partial<JobEntity>) {
        const job = this.create(data);
        return await this.save(job);
    }

    async getJobsByCompany(company_uuid: string) {
        return await this.find({
            where: { company_uuid },
            select: {
                uuid: true,
                position: true,
                location: true,
                role: true,
                min_salary: true,
                max_salary: true,
                created_at: true,

                company: {
                    uuid: true,
                    name: true,
                    location: true,
                    industry: true,
                },

                tags: {
                    uuid: true,
                    tag: true,
                },
            },
            relations: {
                company: true,
                tags: true,
            },
            order: {
                created_at: "DESC",
            },
        });
    }

    async getJobById(uuid: string, company_uuid: string) {
        return await this.findOne({
            where: { uuid, company_uuid },
            select: {
                uuid: true,
                position: true,
                location: true,
                role: true,
                min_salary: true,
                max_salary: true,
                created_at: true,

                company: {
                    uuid: true,
                    name: true,
                    location: true,
                    industry: true,
                },

                tags: {
                    uuid: true,
                    tag: true,
                },
            },
            relations: {
                company: true,
                tags: true,
            },
        });
    }

    async deleteJob(uuid: string) {
        return await this.softDelete({ uuid });
    }

    async getGlobalJobs(offset?: number, limit?: number, tag?: string) {
        const [data, total] = await this.findAndCount({
            where: {
                tags: {
                    tag: tag
                }
            },
            select: {
                uuid: true,
                position: true,
                location: true,
                role: true,
                min_salary: true,
                max_salary: true,
                created_at: true,

                company: {
                    uuid: true,
                    name: true,
                    location: true,
                    industry: true,
                },

                tags: {
                    uuid: true,
                    tag: true,
                },
            },
            relations: {
                company: true,
                tags: true,
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