import { GraphQLSchema } from 'graphql';
import { BuildSchemaOptions, buildSchemaSync } from 'type-graphql';
import { Container } from 'typedi';
import config from '../config';
export function createSchema(options?: Omit<BuildSchemaOptions, 'resolvers'>): GraphQLSchema {
  return buildSchemaSync({
    // resolvers: [`${__dirname}/../resolvers/**/*.resolver.ts`],
    resolvers: config.resolvers,
    emitSchemaFile: true,
    container: Container,
    validate: true,
    ...options,
  });
}
