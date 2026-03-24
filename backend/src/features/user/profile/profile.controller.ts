import { Body, Controller, Delete, Get, Patch, Post, Req } from "@nestjs/common";
import { ProfileService } from "./profile.service";
import type { Request } from "express";
import { CreateProfileDto } from "./dto/create.profile.dto";
import { UpdateProfileDto } from "./dto/update.profile.dto";
import { CreateProfileImageDto } from "./dto/create.profile.image.dto";
import { CreateEducationDto } from "./dto/create.education.dto";
import { UpdateEducationDto } from "./dto/update.education.dto";
import { CreateEmploymentDto } from "./dto/create.employment.dto";
import { UpdateEmploymentDto } from "src/domain/entities/update.employment.dto";

@Controller('/profile')
export class ProfileController {
    constructor(private readonly profileService: ProfileService) { }

    // profile 

    @Post()
    async createProfile(@Req() req: Request, @Body() body: CreateProfileDto) {
        return await this.profileService.createProfile(req.user, body);
    }

    @Get()
    async getProfile(@Req() req: Request) {
        return await this.profileService.getProfile(req.user);
    }

    @Patch()
    async updateProfile(@Req() req: Request, @Body() body: UpdateProfileDto) {
        return await this.profileService.updateProfile(req.user, body);
    }

    @Delete()
    async deleteProfile(@Req() req: Request) {
        return await this.profileService.deleteProfile(req.user);
    }

    @Patch('/img')
    async createProfileImage(@Req() req: Request, @Body() body: CreateProfileImageDto) {
        return await this.profileService.createProfileImage(req.user, body);
    }

    //education

    @Post('/education')
    async addEducation(@Req() req: Request, @Body() body: CreateEducationDto) {
        return await this.profileService.addEducation(req.user, body);
    }

    @Get('/education')
    async getEducation(@Req() req: Request) {
        return await this.profileService.getEducation(req.user);
    }

    @Patch('/education')
    async updateEducation(@Req() req: Request, @Body() body: UpdateEducationDto) {
        return await this.profileService.updateEducation(req.user, body);
    }

    @Delete('/education')
    async deleteEducation(@Req() req: Request, @Body('uuid') uuid: string) {
        return await this.profileService.deleteEducation(req.user, uuid);
    }

    // employment

    @Post('/employment')
    async addEmployment(@Req() req: Request, @Body() body: CreateEmploymentDto) {
        return await this.profileService.addEmployment(req.user, body);
    }

    @Get('/employment')
    async getEmployment(@Req() req: Request) {
        return await this.profileService.getEmployment(req.user);
    }

    @Patch('/employment')
    async updateEmployment(@Req() req: Request, @Body() body: UpdateEmploymentDto) {
        return await this.profileService.updateEmployment(req.user, body);
    }

    @Delete('/employment')
    async deleteEmployment(@Req() req: Request, @Body('uuid') uuid: string) {
        return await this.profileService.deleteEmployment(req.user, uuid);
    }
}