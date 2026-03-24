import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { UserRepository } from "src/infrastructure/repository/user.repo";
import { BcryptService } from "src/infrastructure/services/bcrypt.service";
import { AuthController } from "./auth.controller";
import { AuthHelperService } from "src/infrastructure/services/auth.service";

@Module({
    imports: [],
    controllers: [AuthController],
    providers: [AuthHelperService, UserRepository, AuthService, BcryptService],
    exports: [AuthModule],
})

export class AuthModule { }