import { Module } from "@nestjs/common";
import { RouterModule } from "@nestjs/core";
import { InsightModule } from "./insight/insight.module";

@Module({
    imports: [
        InsightModule,
        RouterModule.register([
            {
                path: 'company',
                children: [
                    { path: '/', module: InsightModule },
                ],
            },
        ]),
    ],
    controllers: [],
    providers: [],
    exports: [CompanyModule],
})

export class CompanyModule { }