import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { Neo4JUserService } from './neo4j-users.service';
import { AuthGuard } from '@festival-planner/backend/auth';
import { Request } from '@nestjs/common';

@Controller('visitors')
export class Neo4JExampleController {
    constructor(private readonly neo4jService: Neo4JUserService) { }

    @Get(':festivalId')
    async getAllVisitors(@Param('festivalId') festivalId: string): Promise<any> {
        const results = await this.neo4jService.findAll(festivalId);
        return results;
    }

    // @Post('')
    // // @UseGuards(AuthGuard)
    // async addUserToFestival(
    //     @Body('userId') userId: string,
    //     @Body('festivalId') festivalId: string
    // ): Promise<any> {
    //     const results = await this.neo4jService.addUserToFestival(userId, festivalId);
    //     return results;
    // }
}