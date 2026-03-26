import { Module } from "@nestjs/common";
import { UserRepository } from "src/infrastructure/repository/user.repo";
import { CompanyRepository } from "src/infrastructure/repository/company.repo";
import { InsightController } from "./insight.controller";
import { InsightService } from "./insight.service";

@Module({
    imports: [],
    controllers: [InsightController],
    providers: [InsightService, UserRepository, CompanyRepository],
    exports: [InsightModule],
})

export class InsightModule { }