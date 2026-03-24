import { Body, Controller, Delete, Get, Patch, Post, Query, Req } from "@nestjs/common";
import { ConnectionService } from "./connection.service";
import type { Request } from "express";

@Controller('/connection')
export class ConnectionController {
    constructor(private readonly connectionService: ConnectionService) { }

    @Get('/global')
    async getConnections(@Req() req, @Query("page") page?: number, @Query("limit") limit?: number,) {
        return await this.connectionService.getConnection(req.user, Number(page), Number(limit));
    }

    @Post('/request')
    async makeConnectionRequest(@Body() body: any, @Req() req: Request) {
    }
}