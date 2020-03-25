import { Field, InputType } from 'type-graphql'
import { UpdateVacantionData, UpdateVacantionInput } from '../../vacantions'
import { ProjectEntity } from '../project.entity'
import { CreateProjectData, CreateProjectInput } from './create-project.dto'

export type UpdateProjectData = Omit<CreateProjectData, 'vacantions'> &
  Pick<ProjectEntity, 'id'> & {
    vacantions: UpdateVacantionData[]
  }

@InputType()
export class UpdateProjectInput implements Omit<CreateProjectInput, 'vacantions'> {
  @Field()
  id: number

  @Field()
  title: string

  @Field()
  description: string

  @Field(() => [Number])
  categoriesIds: number[]

  @Field(() => [UpdateVacantionInput])
  vacantions: UpdateVacantionInput[]

  ownerId: number
}
