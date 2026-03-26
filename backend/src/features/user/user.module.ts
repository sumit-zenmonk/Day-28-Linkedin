import { Module } from "@nestjs/common";
import { ProfileModule } from "./profile/profile.module";
import { ConnectionModule } from "./connection/connection.module";
import { PostModule } from "./post/post.module";
import { RouterModule } from "@nestjs/core";

@Module({
    imports: [
        ProfileModule,
        ConnectionModule,
        PostModule,
        RouterModule.register([
            {
                path: 'user',
                children: [
                    { path: '/', module: ProfileModule },
                    { path: '/', module: ConnectionModule },
                    { path: '/', module: PostModule },
                ],
            },
        ]),
    ],
    controllers: [],
    providers: [],
    exports: [UserModule],
})

export class UserModule { }