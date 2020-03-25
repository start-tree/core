import { Field, InputType } from 'type-graphql'
import { UpdateVacantionDto, UpdateVacantionInput } from '../../vacantions'
import { CreateProjectDto } from './create-project.dto'

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
export class UpdateProjectDto implements CreateProjectDto {
  @Field()
  id: number

  @Field()
  title: string

  @Field()
  description: string

  @Field(() => [Number])
  categoriesIds: number[]

  @Field(() => [UpdateProjectVacantionInput])
  vacantions?: UpdateVacantionDto[]

  ownerId: number
}
