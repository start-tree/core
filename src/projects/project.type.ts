import { Field, ID, ObjectType } from 'type-graphql'
import { User } from '../users'
import { ProjectEntity } from './project.entity'

@ObjectType()
export class Project implements Omit<ProjectEntity, 'owner'> {
  @Field(() => ID)
  id: number

  @Field()
  title: string

  @Field()
  description: string

  @Field()
  ownerId: number

  @Field(() => User)
  owner: User
}
