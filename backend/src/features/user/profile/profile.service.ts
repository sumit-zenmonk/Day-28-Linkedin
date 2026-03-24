import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateProfileDto } from "./dto/create.profile.dto";
import { UpdateProfileDto } from "./dto/update.profile.dto";
import { UserEntity } from "src/domain/entities/user.entity";
import { UserRepository } from "src/infrastructure/repository/user.repo";
import { ProfileRepository } from "src/infrastructure/repository/profile.repo";
import { CreateProfileImageDto } from "./dto/create.profile.image.dto";
import { ImageRepository } from "src/infrastructure/repository/image.repo";
import { EducationRepository } from "src/infrastructure/repository/education.repo";
import { CreateEducationDto } from "./dto/create.education.dto";
import { UpdateEducationDto } from "./dto/update.education.dto";
import { CreateEmploymentDto } from "./dto/create.employment.dto";
import { UpdateEmploymentDto } from "src/domain/entities/update.employment.dto";
import { EmploymentRepository } from "src/infrastructure/repository/employment.repo";

@Injectable()
export class ProfileService {
    constructor(
        private readonly userRepo: UserRepository,
        private readonly profileRepo: ProfileRepository,
        private readonly imageRepo: ImageRepository,
        private readonly educationRepo: EducationRepository,
        private readonly employmentRepo: EmploymentRepository,
    ) { }

    //profile

    async createProfile(user: UserEntity, body: CreateProfileDto) {
        const isUserExists = await this.userRepo.findByUuid(user.uuid);
        if (!isUserExists.length) {
            throw new BadRequestException('User not Exists');
        }

        const existingProfile = await this.profileRepo.findByUserUuid(user.uuid);
        if (existingProfile) {
            throw new BadRequestException('Profile already exists');
        }

        const profile = await this.profileRepo.createProfile({
            user_uuid: user.uuid,
            bio: body.bio,
            mobile_number: body.mobile_number
        });

        return {
            message: "Profile Created",
            profile
        };
    }

    async getProfile(user: UserEntity) {
        const profile = await this.profileRepo.findByUserUuid(user.uuid);

        if (!profile) {
            throw new BadRequestException('Profile not found');
        }

        return {
            message: "Profile fetched",
            profile
        };
    }

    async updateProfile(user: UserEntity, body: UpdateProfileDto) {
        const profile = await this.profileRepo.findByUserUuid(user.uuid);

        if (!profile) {
            throw new BadRequestException('Profile not found');
        }

        const updated = await this.profileRepo.updateProfile(user.uuid, body);

        return {
            message: "Profile updated",
            profile: updated
        };
    }

    async deleteProfile(user: UserEntity) {
        const profile = await this.profileRepo.findByUserUuid(user.uuid);

        if (!profile) {
            throw new BadRequestException('Profile not found');
        }

        await this.profileRepo.deleteProfile(user.uuid);

        return {
            message: "Profile deleted"
        };
    }

    async createProfileImage(user: any, body: CreateProfileImageDto) {
        const profile = await this.profileRepo.findByUserUuid(user.uuid);

        if (!profile) {
            throw new BadRequestException('Profile not found');
        }

        return this.imageRepo.upsertProfileImage({
            user_uuid: user.uuid,
            profile_uuid: profile.uuid,
            image_url: body.image_url,
        });
    }

    // education

    async addEducation(user: UserEntity, body: CreateEducationDto) {
        return this.educationRepo.createEducation({
            ...body,
            user_uuid: user.uuid
        });
    }

    async getEducation(user: UserEntity) {
        return this.educationRepo.findByUserUuid(user.uuid);
    }

    async updateEducation(user: UserEntity, body: UpdateEducationDto) {
        const education = await this.educationRepo.updateEducation(
            user.uuid,
            body.uuid,
            body
        );

        if (!education) {
            throw new BadRequestException('Education not found');
        }

        return {
            message: "Education updated",
            education
        };
    }

    async deleteEducation(user: UserEntity, uuid: string) {
        const result = await this.educationRepo.deleteEducation(user.uuid, uuid);

        if (!result.affected) {
            throw new BadRequestException('Education not found');
        }

        return {
            message: "Education deleted"
        };
    }


    // employment

    async addEmployment(user: UserEntity, body: CreateEmploymentDto) {
        return this.employmentRepo.createEmployment({
            ...body,
            user_uuid: user.uuid,
            start_date: new Date(body.start_date),
            end_date: body.end_date ? new Date(body.end_date) : undefined
        });
    }

    async updateEmployment(user: UserEntity, body: UpdateEmploymentDto) {
        const employment = await this.employmentRepo.updateEmployment(
            user.uuid,
            body.uuid,
            {
                ...body,
                start_date: body.start_date ? new Date(body.start_date) : undefined,
                end_date: body.end_date ? new Date(body.end_date) : undefined
            }
        );

        if (!employment) {
            throw new BadRequestException("Employment not found");
        }

        return {
            message: "Employment updated",
            employment,
        };
    }

    async getEmployment(user: UserEntity) {
        return this.employmentRepo.findByUserUuid(user.uuid);
    }

    async deleteEmployment(user: UserEntity, uuid: string) {
        const result = await this.employmentRepo.deleteEmployment(
            user.uuid,
            uuid
        );

        if (!result.affected) {
            throw new BadRequestException("Employment not found");
        }

        return {
            message: "Employment deleted",
        };
    }
}