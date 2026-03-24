import { Injectable } from "@nestjs/common";
import { ProfileEntity } from "src/domain/entities/user.profile.entity";
import { DataSource, Repository } from "typeorm";

@Injectable()
export class ProfileRepository extends Repository<ProfileEntity> {
    constructor(private readonly dataSource: DataSource) {
        super(ProfileEntity, dataSource.createEntityManager());
    }

    async createProfile(data: Partial<ProfileEntity>) {
        const profile = this.create(data);
        return await this.save(profile);
    }

    async findByUserUuid(user_uuid: string) {
        return await this.findOne({
            where: { user_uuid }
        });
    }

    async updateProfile(user_uuid: string, data: Partial<ProfileEntity>) {
        await this.update({ user_uuid }, data);
        return this.findByUserUuid(user_uuid);
    }

    async deleteProfile(user_uuid: string) {
        return await this.softDelete({ user_uuid });
    }
}