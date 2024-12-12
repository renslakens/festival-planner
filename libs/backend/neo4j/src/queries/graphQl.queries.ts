/**
 * Neo4j GraphQL queries
 */

export const GET_ALL_VISITORS_TO_FESTIVAL: (festivalId: string) => `
MATCH (f:Festival {id: $festivalId})<-[:VISITS]-(u:User)
RETURN f.name AS festivalName, 
        f.date AS festivalDate,
        f.location AS festivalLocation, 
        collect({
            userId: u.id,
            name: u.name,
            email: u.email,
            ticketType: r.ticketType,
            purchasedAt: r.purchasedAt
        }) AS visitors;
`

export const ADD_USER_TO_FESTIVAL = `
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
`