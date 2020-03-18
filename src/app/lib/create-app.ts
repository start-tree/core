import { ApolloServer } from 'apollo-server-express'
import { config as configEnv } from 'dotenv'
import express from 'express'
import 'reflect-metadata'
import { createSchema } from './create-schema'
import { getContext } from './get-context'

configEnv()

export async function createApp() {
  const server = new ApolloServer({
    schema: await createSchema(),
    context: getContext,
  })

  const app = express()

  server.applyMiddleware({ app })

  return { server, app }
}
