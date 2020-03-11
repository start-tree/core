import { ApolloServer } from 'apollo-server-express'
import express from 'express'
import 'reflect-metadata'
import { buildSchemaSync } from 'type-graphql'
import { AuthResolver } from './auth'
import { UsersResolver } from './users'

export function createApp() {
  const server = new ApolloServer({
    schema: buildSchemaSync({
      validate: false,
      resolvers: [UsersResolver, AuthResolver],
    }),
  })

  const app = express()

  server.applyMiddleware({ app })

  return { server, app }
}
