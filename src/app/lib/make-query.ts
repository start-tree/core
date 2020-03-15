import { Express } from 'express'
import supertest from 'supertest'

type MakeQuery = {
  app: Express
  query: string
  token?: string
}

export async function makeQuery({ token, query, app }: MakeQuery) {
  const headers: { Authorization?: string } = {}

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const { body } = await supertest(app)
    .post('/graphql')
    .send({ query })
    .set(headers)

  return body
}
