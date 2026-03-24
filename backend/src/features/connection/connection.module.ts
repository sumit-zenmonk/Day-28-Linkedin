import { Module } from "@nestjs/common";
import { UserRepository } from "src/infrastructure/repository/user.repo";
import { ConnectionController } from "./connection.controller";
import { ConnectionService } from "./connection.service";

@Module({
    imports: [],
    controllers: [ConnectionController],
    providers: [UserRepository, ConnectionService],
    exports: [ConnectionModule],
})

export class ConnectionModule { }