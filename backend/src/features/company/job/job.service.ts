import { BadRequestException, Injectable } from "@nestjs/common";
import { CompanyRepository } from "src/infrastructure/repository/company.repo";
import { JobRepository } from "src/infrastructure/repository/job.repo";
import { CreateJobDto } from "./dto/create.job.dto";
import { UserEntity } from "src/domain/entities/user.entity";
import { JobTagRepository } from "src/infrastructure/repository/job.tag.repo";
import { ApplicationRepository } from "src/infrastructure/repository/application.repo";

@Injectable()
export class JobService {
    constructor(
        private readonly companyRepo: CompanyRepository,
        private readonly jobRepo: JobRepository,
        private readonly jobTagRepo: JobTagRepository,
        private readonly applicationRepo: ApplicationRepository,
    ) { }

    async createJob(user: UserEntity, body: CreateJobDto) {
        const company = await this.companyRepo.findByUserUuid(user.uuid);
        if (!company) {
            throw new BadRequestException("Company not exists");
        }

        const { tags, ...jobData } = body;

        const job = await this.jobRepo.createJob({
            ...jobData,
            company_uuid: company.uuid,
        });

        if (tags?.length) {
            const tagEntities = tags.map((tag) => ({
                job_uuid: job.uuid,
                tag,
            }));
            await this.jobTagRepo.createMany(tagEntities);
        }

        const newJob = await this.jobRepo.getJobById(job.uuid, company.uuid);
        return {
            message: "Job created",
            data: newJob,
        };
    }

    async getCompanyJobs(user: UserEntity) {
        const company = await this.companyRepo.findByUserUuid(user.uuid);
        if (!company) {
            throw new BadRequestException("Company not found");
        }

        const jobs = await this.jobRepo.getJobsByCompany(company.uuid);
        return {
            data: jobs,
        };
    }

    async getJob(user: UserEntity, job_id: string) {
        const company = await this.companyRepo.findByUserUuid(user.uuid);
        if (!company) {
            throw new BadRequestException("Company not found");
        }

        const job = await this.jobRepo.getJobById(job_id, company.uuid);
        if (!job) {
            throw new BadRequestException("Job not found");
        }

        return {
            data: job,
        };
    }

    async deleteJob(user: UserEntity, job_id: string) {
        const company = await this.companyRepo.findByUserUuid(user.uuid);
        if (!company) {
            throw new BadRequestException("Company not found");
        }

        const job = await this.jobRepo.getJobById(job_id, company.uuid);
        if (!job) {
            throw new BadRequestException("Job not found");
        }

        await this.jobRepo.deleteJob(job_id);
        return {
            message: "Job deleted",
        };
    }

    async deleteApplication(user: UserEntity, application_id: string) {
        const isExists = await this.applicationRepo.getApplicationByUUID(application_id);
        if (!isExists) {
            throw new BadRequestException("Application not found");
        }

        await this.applicationRepo.deleteApplication(application_id);
        return {
            message: "Application deleted successfully"
        };
    }

    async getCompanyJobsApplications(user: UserEntity, page?: number, limit?: number) {
        const company = await this.companyRepo.findByUserUuid(user.uuid);
        if (!company) {
            throw new BadRequestException("Company not found");
        }

        const currentPage = page || 1;
        const take = limit || 10;
        const offset = (currentPage - 1) * take;

        const { data, total } = await this.applicationRepo.getCompanyJobsApplications(company.uuid, offset, take);

        return {
            jobs: data,
            totalDocuments: total,
            limit: take,
            offset,
            totalPages: Math.ceil(total / take),
            message: "Company Jobs Applications Fetched Success"
        };
    }

    async getJobApplications(user: UserEntity, job_id: string, page?: number, limit?: number) {
        const company = await this.companyRepo.findByUserUuid(user.uuid);
        if (!company) {
            throw new BadRequestException("Company not found");
        }

        const currentPage = page || 1;
        const take = limit || 10;
        const offset = (currentPage - 1) * take;

        const { data, total } = await this.applicationRepo.getJobApplications(job_id, offset, take);

        return {
            jobs: data,
            totalDocuments: total,
            limit: take,
            offset,
            totalPages: Math.ceil(total / take),
            message: "Job Applications Fetched Success"
        };
    }
} 