import { Field, InputType } from 'type-graphql'
import { UpdateVacantionData, UpdateVacantionInput } from '../../vacantions'
import { ProjectEntity } from '../project.entity'
import { CreateProjectData, CreateProjectInput } from './create-project.dto'

export type UpdateProjectData = Omit<CreateProjectData, 'vacantions'> &
  Pick<ProjectEntity, 'id'> & {
    vacantions: UpdateVacantionData[]
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

@InputType('UpdateProjectInput')
export class UpdateProjectInput implements Omit<CreateProjectInput, 'vacantions'> {
  @Field()
  id: number

  @Field()
  title: string

  @Field()
  description: string

  @Field(() => [Number])
  categoriesIds: number[]

  @Field(() => [UpdateProjectVacantionInput])
  vacantions: UpdateProjectVacantionInput[]

  ownerId: number
}
