import { Module } from "@nestjs/common";
import { EmployeeController } from "./employee.controller";
import { EmployeeService } from "./employee.service";
import { ApplicationRepository } from "src/infrastructure/repository/application.repo";
import { EmployeeRepository } from "src/infrastructure/repository/employee.repo";
import { JobRepository } from "src/infrastructure/repository/job.repo";
import { CompanyRepository } from "src/infrastructure/repository/company.repo";

@Module({
    imports: [],
    controllers: [EmployeeController],
    providers: [EmployeeService, ApplicationRepository, EmployeeRepository, CompanyRepository],
    exports: [EmployeeModule],
})

export class EmployeeModule { }