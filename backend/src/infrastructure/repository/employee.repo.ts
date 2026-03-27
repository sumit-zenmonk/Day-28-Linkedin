import { Injectable } from "@nestjs/common";
import { EmployeeEntity } from "src/domain/entities/employee.entity";
import { DataSource, Repository } from "typeorm";

@Injectable()
export class EmployeeRepository extends Repository<EmployeeEntity> {
    constructor(private readonly dataSource: DataSource) {
        super(EmployeeEntity, dataSource.createEntityManager());
    }

    async createEmployee(data: Partial<EmployeeEntity>) {
        const employee = this.create(data);
        return await this.save(employee);
    }

    async findByEmployeeUuid(emp_uuid: string) {
        return await this.findOne({
            where: {
                uuid: emp_uuid,
            },
            relations: {
                user: {
                    education_histories: true,
                    employment_histories: true,
                },
            },
            select: {
                uuid: true,
                created_at: true,
                user: {
                    uuid: true,
                    name: true,
                    email: true,
                    role: true,
                    education_histories: {
                        uuid: true,
                        school_name: true,
                        start_date: true,
                        end_date: true,
                        specialization: true,
                    },
                    employment_histories: {
                        uuid: true,
                        company_name: true,
                        start_date: true,
                        end_date: true,
                        description: true,
                    },
                },
            },
        });
    }

    async findByEmployeeUsingUserUUID(user_uuid: string) {
        return await this.findOne({
            where: {
                user_uuid
            },
            relations: {
                user: {
                    education_histories: true,
                    employment_histories: true
                }
            }
        });
    }

    async deleteEmployee(uuid: string) {
        return await this.softDelete({ uuid });
    }
}
