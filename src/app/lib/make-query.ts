import { Express } from 'express'
import supertest from 'supertest'

type MakeQuery = {
  app: Express
  query: string
  token?: string
  variables?: object
}

export async function makeQuery({ token, query, app, variables }: MakeQuery) {
  const headers: { Authorization?: string } = {}

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const { body } = await supertest(app)
    .post('/graphql')
    .send({ query, variables })
    .set(headers)

  return body
}
