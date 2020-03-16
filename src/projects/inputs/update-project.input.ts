import { Field, InputType, ID } from 'type-graphql'
import { Project } from '../project.type'

@InputType()
export class UpdateProjectInput implements Pick<Project, 'title' | 'description'> {
  @Field(() => ID)
  id: string

  @Field()
  title: string

  @Field()
  description: string
}
