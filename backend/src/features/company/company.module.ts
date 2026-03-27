import { Module } from "@nestjs/common";
import { RouterModule } from "@nestjs/core";
import { InsightModule } from "./insight/insight.module";
import { JobModule } from "./job/job.module";

@Module({
    imports: [
        InsightModule,
        JobModule,
        RouterModule.register([
            {
                path: 'company',
                children: [
                    { path: '/', module: InsightModule },
                    { path: '/', module: JobModule },
                ],
            },
        ]),
    ],
    controllers: [],
    providers: [],
    exports: [CompanyModule],
})

export class CompanyModule { }