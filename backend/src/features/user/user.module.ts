import { Module } from "@nestjs/common";
import { ProfileModule } from "./profile/profile.module";
import { ConnectionModule } from "./connection/connection.module";
import { PostModule } from "./post/post.module";

@Module({
    imports: [
        ProfileModule,
        ConnectionModule,
        PostModule
    ],
    controllers: [],
    providers: [],
    exports: [UserModule],
})

export class UserModule { }