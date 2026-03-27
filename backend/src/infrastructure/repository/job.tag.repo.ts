import { Injectable } from "@nestjs/common";
import { JobTagEntity } from "src/domain/entities/job.tag.entity";
import { DataSource, Repository } from "typeorm";

@Injectable()
export class JobTagRepository extends Repository<JobTagEntity> {
    constructor(private readonly dataSource: DataSource) {
        super(JobTagEntity, dataSource.createEntityManager());
    }

    async createMany(data: Partial<JobTagEntity>[]) {
        const tags = this.create(data);
        return await this.save(tags);
    }

    async deleteByJob(job_uuid: string) {
        return await this.softDelete({ job_uuid });
    }
}