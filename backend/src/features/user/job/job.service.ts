import { BadRequestException, Injectable } from "@nestjs/common";
import { UserEntity } from "src/domain/entities/user.entity";
import { ApplicationRepository } from "src/infrastructure/repository/application.repo";
import { JobRepository } from "src/infrastructure/repository/job.repo";
import { UserRepository } from "src/infrastructure/repository/user.repo";
import { CreateApplicationDto } from "./dto/create.application.dto";

@Injectable()
export class JobService {
    constructor(
        private readonly jobRepo: JobRepository,
        private readonly applicationRepo: ApplicationRepository,
        private readonly userRepo: UserRepository,
    ) { }

    async getGlobalJobs(page?: number, limit?: number, tag?: string) {
        const currentPage = page || 1;
        const take = limit || 10;
        const offset = (currentPage - 1) * take;

        const { data, total } = await this.jobRepo.getGlobalJobs(offset, take, tag);

        return {
            jobs: data,
            totalDocuments: total,
            limit: take,
            offset,
            totalPages: Math.ceil(total / take),
            message: "Jobs Fetched Success"
        };
    }

    async createJobApplication(user: UserEntity, body: CreateApplicationDto) {
        const isExists = await this.applicationRepo.getAppliedApplication(body.job_uuid, user.uuid);
        if (isExists) {
            throw new BadRequestException("Already Active Application");
        }

        const newApplication = await this.applicationRepo.createApplication({ ...body, user_uuid: user.uuid });
        const application = await this.applicationRepo.getApplicationByUUID(newApplication.uuid);

        return {
            data: application,
            message: "Job Application Applied"
        };
    }

    async deleteJobApplication(application_id: string, user: UserEntity) {
        const isExists = await this.applicationRepo.getApplicationByUUID(application_id);
        if (!isExists) {
            throw new BadRequestException("Application not found");
        }

        await this.applicationRepo.deleteApplication(application_id);
        return {
            message: "Application deleted successfully"
        };
    }

    async getAppliedJobApplication(user: UserEntity, page?: number, limit?: number, tag?: string) {
        const currentPage = page || 1;
        const take = limit || 10;
        const offset = (currentPage - 1) * take;

        const { data, total } = await this.applicationRepo.getAppliedJobs(user.uuid, offset, take);

        return {
            jobs: data,
            totalDocuments: total,
            limit: take,
            offset,
            totalPages: Math.ceil(total / take),
            message: "Applied Jobs Fetched Success"
        };
    }
} 