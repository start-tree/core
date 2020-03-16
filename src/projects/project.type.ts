import { Field, ObjectType } from 'type-graphql'
import { ProjectEntity } from './project.entity'

@ObjectType()
export class Project implements ProjectEntity {
  @Field()
  id: number

  @Field()
  title: string

  @Field()
  description: string
}
