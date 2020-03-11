import { ApolloServer } from 'apollo-server-express'
import express from 'express'
import 'reflect-metadata'
import { buildSchema } from 'type-graphql'
import { AuthResolver } from './auth'
import { UsersResolver } from './users'

async function init() {
  const server = new ApolloServer({
    schema: await buildSchema({
      validate: false,
      resolvers: [UsersResolver, AuthResolver],
    }),
  })

  const app = express()

  server.applyMiddleware({ app })

  app.listen(3100, () => {
    console.log(`Server running on 3100 port`)
  })
}

init()
