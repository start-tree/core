import { buildSchema } from 'type-graphql'
import Container from 'typedi'
import { appResolvers } from '../app.resolvers'
import { authChecker } from './auth-checker'

export function createSchema() {
  return buildSchema({
    validate: false,
    resolvers: appResolvers,
    container: Container,
    authChecker,
  })
}
