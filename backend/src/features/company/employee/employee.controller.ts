import { Body, Controller, Get, Post, Query, Req, UseGuards } from "@nestjs/common";
import type { Request } from "express";
import { RolesGuard } from "src/infrastructure/guard/role/role.guard";
import { RoleEnum } from "src/domain/enums/user";
import { Roles } from "src/infrastructure/guard/role/role.decorator";
import { EmployeeService } from "./employee.service";
import { CreateEmployeeDto } from "./dto/create.employee.dto";

@UseGuards(RolesGuard)
@Roles(RoleEnum.COMPANY)
@Controller("/employee")
export class EmployeeController {
    constructor(private readonly employeeService: EmployeeService) { }

    @Post()
    async createEmployee(@Req() req: Request, @Body() body: CreateEmployeeDto) {
        return await this.employeeService.createEmployee(req.user, body);
    }

    @Get()
    async getCompanyEmployee(@Req() req: Request, @Query("page") page?: number, @Query("limit") limit?: number) {
        return await this.employeeService.getCompanyEmployee(req.user, Number(page), Number(limit));
    }
}