import 'reflect-metadata'
import { UsersResolver } from './users.resolver'
import { buildSchema } from 'type-graphql'
import { ApolloServer } from 'apollo-server-express'
import express from 'express'

async function init() {
  const server = new ApolloServer({
    schema: await buildSchema({
      resolvers: [UsersResolver],
    }),
  })

  const app = express()

  server.applyMiddleware({ app })

  app.listen(3100, () => {
    console.log(`Server running on 3100 port`)
  })
}

init()
