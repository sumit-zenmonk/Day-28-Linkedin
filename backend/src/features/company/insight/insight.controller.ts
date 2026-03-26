import { Body, Controller, Delete, Get, Patch, Post, Req, UseGuards } from "@nestjs/common";
import type { Request } from "express";
import { RolesGuard } from "src/infrastructure/guard/role/role.guard";
import { RoleEnum } from "src/domain/enums/user";
import { Roles } from "src/infrastructure/guard/role/role.decorator";
import { InsightService } from "./insight.service";
import { CreateCompanyDto } from "./dto/create.company.dto";
import { UpdateCompanyDto } from "./dto/update.company.dto";

@UseGuards(RolesGuard)
@Roles(RoleEnum.COMPANY)
@Controller('/Insight')
export class InsightController {
    constructor(private readonly insightService: InsightService) { }

    @Post()
    async createCompany(@Req() req: Request, @Body() body: CreateCompanyDto) {
        return await this.insightService.createCompany(req.user, body);
    }

    @Get()
    async getCompany(@Req() req: Request) {
        return await this.insightService.getCompany(req.user);
    }

    @Patch()
    async updateCompany(@Req() req: Request, @Body() body: UpdateCompanyDto) {
        return await this.insightService.updateCompany(req.user, body);
    }

    @Delete()
    async deleteCompany(@Req() req: Request) {
        return await this.insightService.deleteCompany(req.user);
    }
}