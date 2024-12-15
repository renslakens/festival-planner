import { Injectable, Logger } from '@nestjs/common';
import { Neo4jService } from 'nest-neo4j/dist';

@Injectable()
export class Neo4JUserService {
    private readonly logger: Logger = new Logger(Neo4JUserService.name);

    constructor(private readonly neo4jService: Neo4jService) {}

    async findAll(festivalId: string): Promise<any> {
        const query = `MATCH (f:Festival {id: $festivalId})<-[:VISITS]-(u:User)
        RETURN f.name AS festivalName, 
                f.date AS festivalDate,
                f.location AS festivalLocation, 
                collect({
                    userId: u.id,
                    name: u.name,
                    email: u.email,
                    ticketType: r.ticketType,
                    purchasedAt: r.purchasedAt
                }) AS visitors;`;
        this.logger.log('findAll visitors to festival');
        const results = await this.neo4jService.read(query, { id: festivalId });
        const visitors = results.records.map(
            (record: any) => record._fields[0].start.properties
        );
        return visitors;
    }

    async addUserToFestival(userId: string, festivalId: string): Promise<any> {
        const query = `
        MERGE (u:User {id: $userId})
        ON CREATE SET 
            u.name = $userName,
            u.email = $userEmail

        MERGE (f:Festival {id: $festivalId})
        ON CREATE SET 
            f.name = $festivalName,
            f.date = $festivalDate,
            f.location = $festivalLocation,
            f.is18Plus = $festivalIs18Plus

        MERGE (u)-[r:VISITS]->(f)
        ON CREATE SET 
            r.purchasedAt = datetime()
        RETURN u, f, r;
        `;
        this.logger.log(`add user ${userId} to festival ${festivalId}`);
        const results = await this.neo4jService.write(query, { userId, festivalId });
        return results;
    }
}