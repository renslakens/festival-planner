import { UserService } from '@festival-planner/backend/user';
import { FestivalService } from '@festival-planner/backend/features';
import { Injectable, Logger } from '@nestjs/common';
import { Neo4jService } from 'nest-neo4j/dist';

@Injectable()
export class Neo4JUserService {
    private readonly logger: Logger = new Logger(Neo4JUserService.name);

    constructor(private readonly neo4jService: Neo4jService, 
        // private readonly userService: UserService, private readonly festivalService: FestivalService
    ) {}

    async findAll(festivalId: string): Promise<any> {
        const oldquery = `MATCH (f:Festival {id: $festivalId})<-[:VISITS]-(u:User)
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

        const query = `MATCH (f:Festival {id: $festivalId})<-[:VISITS]-(u:User)
        //-[r:PURCHASED]->(f)
        RETURN f.name AS festivalName, 
        f.date AS festivalDate,
        f.location AS festivalLocation, 
        collect({
            userId: u.id,
            name: u.name,
            email: u.email
            // ticketType: r.ticketType,
            // purchasedAt: r.purchasedAt
        }) AS visitors;
        `;
        this.logger.log(`findAll visitors to festival ${festivalId}`);
        const results = await this.neo4jService.read(query, { festivalId });
        const visitors = results
        .records.map(
            (record: any) => record._fields
        );
        return visitors;
    }

    // async addUserToFestival(userId: string, festivalId: string): Promise<any> {
    //     let userName = "";
    //     let userEmail = "";
    //     let festivalName = "";
    //     let festivalDate = new Date();
    //     let festivalLocation = "";
    //     let festivalIs18Plus = false;

    //     const user = await this.userService.findOne(userId);
    //     if (user) {
    //         this.logger.log(`user found ${user}`);
    //         userName = user.name;
    //         userEmail = user.emailAddress;
    //     }

    //     const festival = await this.festivalService.findOne(festivalId);
    //     if (festival) {
    //         this.logger.log(`festival found ${festival}`);
    //         festivalName = festival.name;
    //         festivalDate = festival.date;
    //         festivalLocation = festival.location;
    //         festivalIs18Plus = festival.is18Plus;
    //     }

    //     const query = `
    //     MERGE (u:User {id: $userId})
    //     ON CREATE SET 
    //         u.name = $userName,
    //         u.email = $userEmail

    //     MERGE (f:Festival {id: $festivalId})
    //     ON CREATE SET 
    //         f.name = $festivalName,
    //         f.date = $festivalDate,
    //         f.location = $festivalLocation,
    //         f.is18Plus = $festivalIs18Plus

    //     MERGE (u)-[r:VISITS]->(f)
    //     ON CREATE SET 
    //         r.purchasedAt = datetime()
    //     RETURN u, f, r;
    //     `;
    //     this.logger.log(`add user ${userId} to festival ${festivalId}`);
    //     const results = await this.neo4jService.write(query, { userId, festivalId, userName, userEmail, festivalName, festivalDate, festivalLocation, festivalIs18Plus });
    //     return results;
    // }
}