import { Module } from "@nestjs/common";
import { UserRepository } from "src/infrastructure/repository/user.repo";
import { CompanyRepository } from "src/infrastructure/repository/company.repo";
import { JobController } from "./job.controller";
import { JobService } from "./job.service";
import { JobRepository } from "src/infrastructure/repository/job.repo";
import { JobTagRepository } from "src/infrastructure/repository/job.tag.repo";
import { ApplicationRepository } from "src/infrastructure/repository/application.repo";

@Module({
    imports: [],
    controllers: [JobController],
    providers: [JobService, UserRepository, CompanyRepository, JobRepository, JobTagRepository, ApplicationRepository],
    exports: [JobModule],
})

export class JobModule { }