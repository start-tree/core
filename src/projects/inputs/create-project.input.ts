import { Field, InputType } from 'type-graphql'
import { Project } from './../project.type'
import { CreateVacantionInput } from '../../vacantions'

@InputType()
class CreateProjectVacantionInput implements Omit<CreateVacantionInput, 'projectId'> {
  @Field()
  title: string

  @Field()
  description: string
}

@InputType()
export class CreateProjectInput implements Pick<Project, 'title' | 'description'> {
  @Field()
  title: string

  @Field()
  description: string

  @Field(() => [CreateProjectVacantionInput])
  vacantions: CreateProjectVacantionInput[]
}
