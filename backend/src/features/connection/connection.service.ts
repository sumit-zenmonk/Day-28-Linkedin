import { BadRequestException, Injectable } from "@nestjs/common";
import { UserEntity } from "src/domain/entities/user.entity";
import { UserRepository } from "src/infrastructure/repository/user.repo";

@Injectable()
export class ConnectionService {
    constructor(
        private readonly userRepo: UserRepository,
    ) { }

    async getConnection(user: UserEntity, page?: number, limit?: number) {
        const currentPage = page ?? 1;
        const take = limit ?? 10;
        const offset = (currentPage - 1) * take;

        const { data, total } = await this.userRepo.getConnections(user.uuid, offset, take);

        return {
            connections: data,
            totalDocuments: total,
            limit: take,
            offset,
            totalPages: Math.ceil(total / take),
            message: "Connections Fetched Success"
        };
    }
}