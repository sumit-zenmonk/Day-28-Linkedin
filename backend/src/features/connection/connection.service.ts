import { BadRequestException, Injectable } from "@nestjs/common";
import { UserEntity } from "src/domain/entities/user.entity";
import { UserRepository } from "src/infrastructure/repository/user.repo";
import { ConnectionRequestCreateDto } from "./dto/create.connection.request.dto";
import { ConnectionRequestRepository } from "src/infrastructure/repository/connection.request.repo";
import { ConnectionRequestDeleteDto } from "./dto/delete.connection.request.dto";
import { ConnectionCreateDto } from "./dto/create.connection.dto";
import { ConnectionRepository } from "src/infrastructure/repository/connection.repo";

@Injectable()
export class ConnectionService {
    constructor(
        private readonly userRepo: UserRepository,
        private readonly connectionRequestRepo: ConnectionRequestRepository,
        private readonly connectionRepo: ConnectionRepository,
    ) { }

    async getGlobalConnection(user: UserEntity, page?: number, limit?: number) {
        const currentPage = page || 1;
        const take = limit || 10;
        const offset = (currentPage - 1) * take;

        const { data, total } = await this.userRepo.getGlobalConnection(user.uuid, offset, take);

        return {
            connections: data,
            totalDocuments: total,
            limit: take,
            offset,
            totalPages: Math.ceil(total / take),
            message: "Connections Fetched Success"
        };
    }

    async createConnectionRequest(user: UserEntity, body: ConnectionRequestCreateDto) {
        const isAlreadyExists = await this.connectionRequestRepo.findConnectionRequest(user.uuid, body.connected_user_uuid);
        if (isAlreadyExists) {
            throw new BadRequestException("Request Still Active");
        }

        const newRequest = await this.connectionRequestRepo.createConnectionRequest({ ...body, user_uuid: user.uuid });
        return {
            data: newRequest,
            message: "Request Sent Success"
        }
    }

    async getConnectionRequests(user: UserEntity, page?: number, limit?: number) {
        const currentPage = page || 1;
        const take = limit || 10;
        const offset = (currentPage - 1) * take;

        const { data, total } = await this.connectionRequestRepo.getConnectionRequests(user.uuid, offset, take);

        return {
            connectionsRequests: data,
            totalDocuments: total,
            limit: take,
            offset,
            totalPages: Math.ceil(total / take),
            message: "Request fetched Success"
        }
    }

    async deleteConnectionRequest(user: UserEntity, body: ConnectionRequestDeleteDto) {
        await this.connectionRequestRepo.deleteConnectionRequest(body.uuid);
        return {
            message: "Request Deleted Success"
        }
    }

    async getConnectionRequestsInvite(user: UserEntity, page?: number, limit?: number) {
        const currentPage = page || 1;
        const take = limit || 10;
        const offset = (currentPage - 1) * take;

        const { data, total } = await this.connectionRequestRepo.getConnectionRequestsInvite(user.uuid, offset, take);

        return {
            connectionsRequests: data,
            totalDocuments: total,
            limit: take,
            offset,
            totalPages: Math.ceil(total / take),
            message: "Request Invite fetched Success"
        }
    }

    async createConnection(user: UserEntity, body: ConnectionCreateDto) {
        const isAlreadyExists = await this.connectionRequestRepo.findConnectionRequestByUUID(body.request_uuid);
        if (!isAlreadyExists) {
            throw new BadRequestException("Request not found");
        }

        const connection = await this.connectionRepo.createConnection({ user_uuid: isAlreadyExists.user_uuid, connected_user_uuid: isAlreadyExists.connected_user_uuid });
        await this.connectionRepo.createConnection({ connected_user_uuid: isAlreadyExists.user_uuid, user_uuid: isAlreadyExists.connected_user_uuid });
        await this.connectionRequestRepo.deleteConnectionRequest(isAlreadyExists.uuid);

        return {
            data: connection,
            message: "Connection Established Success"
        }
    }

    async getConnections(user: UserEntity, page?: number, limit?: number) {
        const currentPage = page || 1;
        const take = limit || 10;
        const offset = (currentPage - 1) * take;

        const { data, total } = await this.connectionRepo.getConnections(user.uuid, offset, take);

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