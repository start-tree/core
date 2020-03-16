import { Field, InputType } from 'type-graphql'
import { Project } from './../project.type'

@InputType()
export class CreateProjectInput implements Pick<Project, 'title' | 'description' | 'ownerId'> {
  @Field()
  title: string

  @Field()
  description: string

  @Field()
  ownerId: number
}
