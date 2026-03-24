import { Injectable } from "@nestjs/common";
import { EmploymentHistoryEntity } from "src/domain/entities/user.employment.history.entity";
import { DataSource, Repository } from "typeorm";

@Injectable()
export class EmploymentRepository extends Repository<EmploymentHistoryEntity> {
    constructor(private readonly dataSource: DataSource) {
        super(
            EmploymentHistoryEntity,
            dataSource.createEntityManager()
        );
    }

    async createEmployment(data: Partial<EmploymentHistoryEntity>) {
        const employment = this.create(data);
        return await this.save(employment);
    }

    async findByUserUuid(user_uuid: string) {
        return await this.find({
            where: { user_uuid },
            order: { start_date: "DESC" },
        });
    }

    async updateEmployment(
        user_uuid: string,
        uuid: string,
        data: Partial<EmploymentHistoryEntity>
    ) {
        await this.update({ user_uuid, uuid }, data);

        return this.findOne({
            where: { user_uuid, uuid },
        });
    }

    async deleteEmployment(user_uuid: string, uuid: string) {
        return await this.softDelete({ user_uuid, uuid });
    }
}