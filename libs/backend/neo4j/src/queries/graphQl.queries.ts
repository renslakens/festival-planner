/**
 * Neo4j GraphQL queries
 */

export const GET_ALL_USERS = `MATCH people=()-[:WorksIn]->(t:Team {name:'Informatica'}) RETURN people;`