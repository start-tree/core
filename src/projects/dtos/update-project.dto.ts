import { Field, InputType } from 'type-graphql'
import { UpdateVacantionDto, UpdateVacantionInput } from '../../vacantions'
import { CreateProjectDto, CreateProjectInput } from './create-project.dto'

export class UpdateProjectDto implements CreateProjectDto {
  id: number

  title: string

  description: string

  ownerId: number

  categoriesIds: number[]

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
export class UpdateProjectInput implements CreateProjectInput {
  @Field()
  id: number

  @Field()
  title: string

  @Field()
  description: string

  @Field(() => [Number])
  categoriesIds: number[]

  @Field(() => [UpdateProjectVacantionInput], { nullable: true })
  vacantions?: UpdateProjectVacantionInput[]
}
