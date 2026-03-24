import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { EducationHistoryEntity } from "src/domain/entities/user.education.history.entity";

@Injectable()
export class EducationRepository extends Repository<EducationHistoryEntity> {
    constructor(private readonly dataSource: DataSource) {
        super(EducationHistoryEntity, dataSource.createEntityManager());
    }

    async createEducation(data: Partial<EducationHistoryEntity>) {
        const education = this.create(data);
        return await this.save(education);
    }

    async findByUserUuid(user_uuid: string) {
        return await this.find({
            where: { user_uuid },
            order: { start_date: "DESC" }
        });
    }

    async updateEducation(user_uuid: string, uuid: string, data: Partial<EducationHistoryEntity>) {
        await this.update({ user_uuid, uuid }, data);
        return this.findOne({
            where: { user_uuid, uuid }
        });
    }

    async deleteEducation(user_uuid: string, uuid: string) {
        return await this.softDelete({ user_uuid, uuid });
    }
}
