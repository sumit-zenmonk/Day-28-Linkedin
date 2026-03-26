import { BadRequestException, Injectable } from "@nestjs/common";
import { CompanyRepository } from "src/infrastructure/repository/company.repo";
import { UserRepository } from "src/infrastructure/repository/user.repo";
import { CreateCompanyDto } from "./dto/create.company.dto";
import { UpdateCompanyDto } from "./dto/update.company.dto";
import { UserEntity } from "src/domain/entities/user.entity";

@Injectable()
export class InsightService {
    constructor(
        private readonly userRepo: UserRepository,
        private readonly companyRepo: CompanyRepository,
    ) { }

    async createCompany(user: UserEntity, body: CreateCompanyDto) {
        const isUserExists = await this.userRepo.findByUuid(user.uuid);
        if (!isUserExists.length) {
            throw new BadRequestException("User not exists");
        }

        const existing = await this.companyRepo.findByUserUuid(user.uuid);
        if (existing) {
            throw new BadRequestException("Company already exists");
        }

        const company = await this.companyRepo.createCompany({
            ...body,
            user_uuid: user.uuid
        });

        return {
            message: "Company created",
            company
        };
    }

    async getCompany(user: UserEntity) {
        const company = await this.companyRepo.findByUserUuid(user.uuid);

        if (!company) {
            throw new BadRequestException("Company not found");
        }

        return {
            message: "Company fetched",
            company
        };
    }

    async updateCompany(user: UserEntity, body: UpdateCompanyDto) {
        const company = await this.companyRepo.findByUserUuid(user.uuid);

        if (!company) {
            throw new BadRequestException("Company not found");
        }

        const updated = await this.companyRepo.updateCompany(user.uuid, body);

        return {
            message: "Company updated",
            company: updated
        };
    }

    async deleteCompany(user: UserEntity) {
        const company = await this.companyRepo.findByUserUuid(user.uuid);

        if (!company) {
            throw new BadRequestException("Company not found");
        }

        await this.companyRepo.deleteCompany(user.uuid);

        return {
            message: "Company deleted"
        };
    }
}