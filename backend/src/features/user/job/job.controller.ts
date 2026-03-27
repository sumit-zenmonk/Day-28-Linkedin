import { Body, Controller, Delete, Get, Param, Post, Query, Req, UseGuards, } from "@nestjs/common";
import type { Request } from "express";
import { RolesGuard } from "src/infrastructure/guard/role/role.guard";
import { RoleEnum } from "src/domain/enums/user";
import { Roles } from "src/infrastructure/guard/role/role.decorator";
import { JobService } from "./job.service";
import { CreateApplicationDto } from "./dto/create.application.dto";

@UseGuards(RolesGuard)
@Roles(RoleEnum.USER)
@Controller("/job")
export class JobController {
    constructor(private readonly jobService: JobService) { }

    @Get()
    async getGlobalJobs(@Req() req: Request, @Query("page") page?: number, @Query("limit") limit?: number, @Query("tag") tag?: string) {
        return await this.jobService.getGlobalJobs(Number(page), Number(limit), tag);
    }

    @Post("application")
    async createJobApplication(@Req() req: Request, @Body() body: CreateApplicationDto) {
        return await this.jobService.createJobApplication(req.user, body);
    }

    @Get("application")
    async getAppliedJobApplication(@Req() req: Request, @Query("page") page?: number, @Query("limit") limit?: number) {
        return await this.jobService.getAppliedJobApplication(req.user, Number(page), Number(limit));
    }

    @Delete("application/:application_id")
    async deleteJobApplication(@Req() req: Request, @Param("application_id") application_id: string) {
        return await this.jobService.deleteJobApplication(application_id, req.user);
    }
}