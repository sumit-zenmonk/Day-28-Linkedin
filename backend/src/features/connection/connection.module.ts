import { Module } from "@nestjs/common";
import { UserRepository } from "src/infrastructure/repository/user.repo";
import { ConnectionController } from "./connection.controller";
import { ConnectionService } from "./connection.service";
import { ConnectionRequestRepository } from "src/infrastructure/repository/connection.request.repo";
import { ConnectionRepository } from "src/infrastructure/repository/connection.repo";

@Module({
    imports: [],
    controllers: [ConnectionController],
    providers: [UserRepository, ConnectionService, ConnectionRequestRepository, ConnectionRepository],
    exports: [ConnectionModule],
})

export class ConnectionModule { }