import { Field, ID, InputType } from 'type-graphql'
import { Project } from '../project.type'
import { UpdateVacantionInput } from './../../vacantions'

@InputType()
class UpdateProjectVacantionInput implements Omit<UpdateVacantionInput, 'projectId' | 'id'> {
  @Field(() => ID, { nullable: true })
  id?: string

  @Field()
  title: string

  @Field()
  description: string

  @Field({ nullable: true })
  projectId?: number
}

@InputType()
export class UpdateProjectInput implements Pick<Project, 'title' | 'description'> {
  @Field(() => ID)
  id: string

  @Field()
  title: string

  @Field()
  description: string

  @Field(() => [UpdateProjectVacantionInput])
  vacantions: UpdateProjectVacantionInput[]
}
