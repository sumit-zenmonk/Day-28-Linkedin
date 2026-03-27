import { Module } from "@nestjs/common";
import { ProfileModule } from "./profile/profile.module";
import { ConnectionModule } from "./connection/connection.module";
import { PostModule } from "./post/post.module";
import { RouterModule } from "@nestjs/core";
import { JobModule } from "./job/job.module";

@Module({
    imports: [
        ProfileModule,
        ConnectionModule,
        PostModule,
        JobModule,
        RouterModule.register([
            {
                path: 'user',
                children: [
                    { path: '/', module: ProfileModule },
                    { path: '/', module: ConnectionModule },
                    { path: '/', module: PostModule },
                    { path: '/', module: JobModule },
                ],
            },
        ]),
    ],
    controllers: [],
    providers: [],
    exports: [UserModule],
})

export class UserModule { }