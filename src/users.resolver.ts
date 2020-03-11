import { Resolver, Query } from 'type-graphql'
import { User } from './user'

@Resolver(User)
export class UsersResolver {
  @Query(() => [User])
  users(): User[] {
    return [{ id: '1', email: 'vike', passwordHash: 'passs' }]
  }
}
