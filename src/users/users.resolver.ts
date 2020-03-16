import { Query, Resolver } from 'type-graphql'
import { User } from './user.type'

@Resolver()
export class UsersResolver {
  @Query(() => [User])
  users(): User[] {
    return [{ id: 1, email: 'vike', name: 'bike' }]
  }
}
