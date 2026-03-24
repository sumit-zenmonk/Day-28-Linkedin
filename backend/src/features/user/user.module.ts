import { Module } from "@nestjs/common";
import { ProfileModule } from "./profile/profile.module";

@Module({
    imports: [ProfileModule],
    controllers: [],
    providers: [],
    exports: [UserModule],
})

export class UserModule { }