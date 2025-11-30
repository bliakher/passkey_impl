import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    // GraphQL
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: false, // playground deprecated in Apollo
      graphiql: true,
      autoSchemaFile: `${process.cwd()}/src/schema.gql`,
      sortSchema: true,
    }),
    // .env configuration
    ConfigModule.forRoot(),
    // modules
    UsersModule,
  ],
})
export class AppModule {}
