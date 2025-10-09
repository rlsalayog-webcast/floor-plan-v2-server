import GraphQLJSON from "graphql-type-json";
import * as Mutation from "./mutation";
import * as Query from "./query";

export const resolvers = {
    JSON: GraphQLJSON,
    Query,
    Mutation,
};
