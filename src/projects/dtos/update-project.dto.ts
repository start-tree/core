import { Field, InputType } from 'type-graphql'
import { UpdateVacantionDto, UpdateVacantionInput } from '../../vacantions'
import { Project } from '../project.type'
import { CreateProjectDto } from './create-project.dto'

export class UpdateProjectDto implements CreateProjectDto {
  id: number

  title: string

  description: string

  ownerId: number

  vacantions?: UpdateVacantionDto[]
}

@InputType()
class UpdateProjectVacantionInput implements Omit<UpdateVacantionInput, 'projectId' | 'id'> {
  @Field({ nullable: true })
  id?: number

  @Field()
  title: string

  @Field()
  description: string

  @Field({ nullable: true })
  projectId?: number
}

@InputType()
export class UpdateProjectInput
  implements Omit<Project, 'id' | 'ownerId' | 'owner' | 'vacantions'> {
  @Field()
  id: number

  @Field()
  title: string

  @Field()
  description: string

  @Field(() => [UpdateProjectVacantionInput], { nullable: true })
  vacantions?: UpdateProjectVacantionInput[]
}
