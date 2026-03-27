import { Module } from "@nestjs/common";
import { RouterModule } from "@nestjs/core";
import { InsightModule } from "./insight/insight.module";
import { JobModule } from "./job/job.module";
import { EmployeeModule } from "./employee/employee.module";

@Module({
    imports: [
        InsightModule,
        JobModule,
        EmployeeModule,
        RouterModule.register([
            {
                path: 'company',
                children: [
                    { path: '/', module: InsightModule },
                    { path: '/', module: JobModule },
                    { path: '/', module: EmployeeModule },
                ],
            },
        ]),
    ],
    controllers: [],
    providers: [],
    exports: [CompanyModule],
})

export class CompanyModule { }