import { Module } from "@nestjs/common";
import { UserRepository } from "src/infrastructure/repository/user.repo";
import { JobController } from "./job.controller";
import { JobService } from "./job.service";
import { JobRepository } from "src/infrastructure/repository/job.repo";
import { ApplicationRepository } from "src/infrastructure/repository/application.repo";

@Module({
    imports: [],
    controllers: [JobController],
    providers: [JobService, UserRepository, JobRepository, ApplicationRepository],
    exports: [JobModule],
})

export class JobModule { }