import { Module } from "@nestjs/common";
import { UserRepository } from "src/infrastructure/repository/user.repo";
import { ProfileService } from "./profile.service";
import { ProfileController } from "./profile.controller";
import { ProfileRepository } from "src/infrastructure/repository/profile.repo";
import { ImageRepository } from "src/infrastructure/repository/image.repo";
import { EducationRepository } from "src/infrastructure/repository/education.repo";
import { EmploymentRepository } from "src/infrastructure/repository/employment.repo";

@Module({
    imports: [],
    controllers: [ProfileController],
    providers: [ProfileService, UserRepository, ProfileRepository, ImageRepository, EducationRepository, EmploymentRepository],
    exports: [ProfileModule],
})

export class ProfileModule { }