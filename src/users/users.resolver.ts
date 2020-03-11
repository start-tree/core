import { Query, Resolver } from 'type-graphql'
import { UserObjectType } from './object-types/user.object-type'

@Resolver()
export class UsersResolver {
  @Query(() => [UserObjectType])
  users(): UserObjectType[] {
    return [{ id: '1', email: 'vike', passwordHash: 'passs' }]
  }
}
