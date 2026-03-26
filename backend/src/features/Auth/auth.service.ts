import { UserRepository } from "src/infrastructure/repository/user.repo";
import { RegisterDto } from "./dto/register.dto";
import { BadRequestException, Injectable } from "@nestjs/common";
import { AuthHelperService } from "src/infrastructure/services/auth.service";
import { BcryptService } from "src/infrastructure/services/bcrypt.service";
import { LoginDto } from "./dto/login.dto";
import admin from "src/infrastructure/firebase/firebase-admin.config";
import { RoleEnum } from "src/domain/enums/user";

@Injectable()
export class AuthService {
    constructor(
        private readonly userRepo: UserRepository,
        private readonly authService: AuthHelperService,
        private readonly bcryptService: BcryptService
    ) { }

    async registerUser(body: RegisterDto) {
        //check if already exists using this email
        const isUserExists = await this.userRepo.findByEmail(body.email);
        if (isUserExists.length) {
            throw new BadRequestException('User Already Exists with this Email');
        }

        //hashed password using bcrypt
        body.password = await this.bcryptService.hashPassword(body.password);

        //register user in DB
        const RegisteredUser = await this.userRepo.register(body);

        // generate token for accessing resources
        const token = await this.authService.generateJwtToken(RegisteredUser);
        return {
            message: "Registered User",
            access_token: token,
            user: {
                name: RegisteredUser.name,
                email: RegisteredUser.email,
                role: RegisteredUser.role,
                uid: RegisteredUser.uuid,
            }
        }
    }

    async loginUser(body: LoginDto) {
        //check if already exists using this email
        const isUserExists = await this.userRepo.findByEmail(body.email);
        if (!isUserExists.length) {
            throw new BadRequestException('User not Exists with this Email ');
        }

        const isValid = await this.bcryptService.verifyPassword(body.password, isUserExists[0].password);

        if (!isValid) {
            throw new BadRequestException('Password not matched');
        }

        const token = await this.authService.generateJwtToken(isUserExists[0]);
        return {
            message: "Logged In User",
            access_token: token,
            user: {
                name: isUserExists[0].name,
                email: isUserExists[0].email,
                role: isUserExists[0].role,
                uid: isUserExists[0].uuid,
            }
        }
    }

    async googleAuth(idToken: string) {
        try {
            const decodedToken = await admin.auth().verifyIdToken(idToken);
            const { email, name, uid: googleUid, picture } = decodedToken;

            if (!email) {
                throw new BadRequestException("Email not found in Google account");
            }

            let users = await this.userRepo.findByEmail(email);
            let user;

            if (!users.length) {
                const randomPassword = "0000";
                const hashedPassword = await this.bcryptService.hashPassword(randomPassword);
                const newUser = await this.userRepo.register({
                    email,
                    name: name || "Google User",
                    password: hashedPassword,
                    role:RoleEnum.USER
                });
                user = newUser;
            } else {
                user = users[0];
            }

            const token = await this.authService.generateJwtToken(user);
            return {
                message: "Google Auth Success",
                access_token: token,
                user: {
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    uid: user.uuid,
                }
            };

        } catch (error) {
            console.error("Google Auth Error:", error);
            throw new BadRequestException("Invalid Google token");
        }
    }
}