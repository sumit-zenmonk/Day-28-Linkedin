import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards, } from "@nestjs/common";
import type { Request } from "express";
import { RolesGuard } from "src/infrastructure/guard/role/role.guard";
import { RoleEnum } from "src/domain/enums/user";
import { Roles } from "src/infrastructure/guard/role/role.decorator";
import { JobService } from "./job.service";
import { CreateJobDto } from "./dto/create.job.dto";

@UseGuards(RolesGuard)
@Roles(RoleEnum.COMPANY)
@Controller("/job")
export class JobController {
    constructor(private readonly jobService: JobService) { }

    @Post()
    async createJob(@Req() req: Request, @Body() body: CreateJobDto) {
        return await this.jobService.createJob(req.user, body);
    }

    @Get()
    async getCompanyJobs(@Req() req: Request) {
        return await this.jobService.getCompanyJobs(req.user);
    }

    @Get("/:job_id")
    async getJob(@Req() req: Request, @Param("job_id") job_id: string) {
        return await this.jobService.getJob(req.user, job_id);
    }

    @Delete("/:job_id")
    async deleteJob(@Req() req: Request, @Param("job_id") job_id: string) {
        return await this.jobService.deleteJob(req.user, job_id);
    }
}