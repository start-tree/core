import { ApolloServer } from 'apollo-server-express'
import { config as configEnv } from 'dotenv'
import express from 'express'
import 'reflect-metadata'
import { buildSchema } from 'type-graphql'
import { Container } from 'typedi'
import { AuthResolver } from '../auth'
import { UsersResolver } from '../users'
import { authChecker, getContext } from './lib'

configEnv()

export async function createApp() {
  const server = new ApolloServer({
    schema: await buildSchema({
      validate: false,
      resolvers: [UsersResolver, AuthResolver],
      container: Container,
      authChecker,
    }),
    context: getContext,
  })

  const app = express()

  server.applyMiddleware({ app })

  return { server, app }
}
