import { Field, InputType } from 'type-graphql'
import { Project } from './../project.type'

@InputType()
export class CreateProjectInput implements Pick<Project, 'title' | 'description'> {
  @Field()
  title: string

  @Field()
  description: string
}
