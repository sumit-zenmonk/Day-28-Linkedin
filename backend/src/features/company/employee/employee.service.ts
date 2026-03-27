import { BadRequestException, Injectable } from "@nestjs/common";
import { UserEntity } from "src/domain/entities/user.entity";
import { CreateEmployeeDto } from "./dto/create.employee.dto";
import { ApplicationRepository } from "src/infrastructure/repository/application.repo";
import { EmployeeRepository } from "src/infrastructure/repository/employee.repo";
import { JobRepository } from "src/infrastructure/repository/job.repo";
import { CompanyRepository } from "src/infrastructure/repository/company.repo";

@Injectable()
export class EmployeeService {
    constructor(
        private readonly applicationRepo: ApplicationRepository,
        private readonly employeeRepo: EmployeeRepository,
        private readonly companyRepo: CompanyRepository,
    ) { }

    async createEmployee(user: UserEntity, body: CreateEmployeeDto) {
        const appliedJob = await this.applicationRepo.getApplicationByUUID(body.application_uuid);
        if (!appliedJob) {
            throw new BadRequestException("Application Not Exists Anymore");
        }

        const isEmployeeExists = await this.employeeRepo.findByEmployeeUsingUserUUID(appliedJob?.user_uuid);
        if (isEmployeeExists) {
            throw new BadRequestException("Applicant is employee already");
        }

        const employee = await this.employeeRepo.createEmployee({ company_uuid: appliedJob?.job.company_uuid, user_uuid: appliedJob?.user_uuid });
        const employeeData = await this.employeeRepo.findByEmployeeUuid(employee.uuid);

        // company hier muany employees
        // await this.jobRepo.deleteJob(appliedJob.job_uuid);
        await this.applicationRepo.deleteApplication(appliedJob.uuid);
        return {
            data: employeeData,
            message: "Employee Added"
        }
    }

    async getCompanyEmployee(user: UserEntity, page?: number, limit?: number) {
        const currentPage = page || 1;
        const take = limit || 10;
        const offset = (currentPage - 1) * take;

        const company = await this.companyRepo.findByUserUuid(user.uuid);
        if (!company) {
            throw new BadRequestException("Company not found");
        }

        const { data, total } = await this.companyRepo.getCompanyEmployee(company.uuid, offset, take);

        return {
            jobs: data,
            totalDocuments: total,
            limit: take,
            offset,
            totalPages: Math.ceil(total / take),
            message: "Company Employees Fetched Success"
        };
    }

} 