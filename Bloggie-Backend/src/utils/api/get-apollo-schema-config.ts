import UserResolver from "@services/resolvers/user-resolver";
import { ApolloServerExpressConfig } from "apollo-server-express";
import { buildSchema } from "type-graphql";

export default async function getApolloConfig(): Promise<ApolloServerExpressConfig> {
  const resolversDir = `${__dirname}/../../services/resolvers/**/*.ts`;
  return {
    schema: await buildSchema({
      resolvers: [resolversDir],
    }),
  };
}
