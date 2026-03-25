import { Body, Controller, Delete, Get, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";
import { ConnectionService } from "./connection.service";
import type { Request } from "express";
import { ConnectionRequestCreateDto } from "./dto/create.connection.request.dto";
import { ConnectionRequestDeleteDto } from "./dto/delete.connection.request.dto";
import { ConnectionCreateDto } from "./dto/create.connection.dto";
import { Roles } from "src/infrastructure/guard/role/role.decorator";
import { RolesGuard } from "src/infrastructure/guard/role/role.guard";
import { RoleEnum } from "src/domain/enums/user";

@UseGuards(RolesGuard)
@Roles(RoleEnum.USER)
@Controller('/connection')
export class ConnectionController {
    constructor(private readonly connectionService: ConnectionService) { }

    @Get('/global')
    async getGlobalConnection(@Req() req, @Query("page") page?: number, @Query("limit") limit?: number,) {
        return await this.connectionService.getGlobalConnection(req.user, Number(page), Number(limit));
    }

    @Post('/request')
    async createConnectionRequest(@Body() body: ConnectionRequestCreateDto, @Req() req: Request) {
        return await this.connectionService.createConnectionRequest(req.user, body);
    }

    @Get('/request')
    async getConnectionRequests(@Req() req, @Query("page") page?: number, @Query("limit") limit?: number,) {
        return await this.connectionService.getConnectionRequests(req.user, Number(page), Number(limit));
    }

    @Delete('/request')
    async deleteConnectionRequest(@Body() body: ConnectionRequestDeleteDto, @Req() req: Request) {
        return await this.connectionService.deleteConnectionRequest(req.user, body);
    }

    @Get('/request/invite')
    async getConnectionRequestsInvite(@Req() req, @Query("page") page?: number, @Query("limit") limit?: number,) {
        return await this.connectionService.getConnectionRequestsInvite(req.user, Number(page), Number(limit));
    }

    @Post('/')
    async createConnection(@Body() body: ConnectionCreateDto, @Req() req: Request) {
        return await this.connectionService.createConnection(req.user, body);
    }

    @Get('/')
    async getConnections(@Req() req, @Query("page") page?: number, @Query("limit") limit?: number,) {
        return await this.connectionService.getConnections(req.user, Number(page), Number(limit));
    }
}