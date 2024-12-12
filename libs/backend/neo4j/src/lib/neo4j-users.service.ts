import { Injectable, Logger } from '@nestjs/common';
import { Neo4jService } from 'nest-neo4j/dist';
import * as graphQl from '../queries/graphQl.queries';

@Injectable()
export class Neo4JUserService {
    private readonly logger: Logger = new Logger(Neo4JUserService.name);

    constructor(private readonly neo4jService: Neo4jService) {}

    async findAll(festivalId: string): Promise<any> {
        this.logger.log('findAll visitors to festival');
        const results = await this.neo4jService.read(
            graphQl.GET_ALL_VISITORS_TO_FESTIVAL(festivalId)
        );
        const visitors = results.records.map(
            (record: any) => record._fields[0].start.properties
        );
        return visitors;
    }

    async addUserToFestival(userId: string, festivalId: string): Promise<any> {
        this.logger.log(`add user ${userId} to festival ${festivalId}`);
        const results = await this.neo4jService.write(
            graphQl.ADD_USER_TO_FESTIVAL(userId, festivalId)
        );
        return results;
    }
}