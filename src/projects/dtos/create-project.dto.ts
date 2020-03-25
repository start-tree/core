import { Field, InputType } from 'type-graphql'
import { CreateVacantionDto, CreateVacantionInput } from '../../vacantions'
import { ProjectEntity } from '../project.entity'

export class CreateProjectDto
  implements Omit<ProjectEntity, 'id' | 'owner' | 'vacantions' | 'categories'> {
  title: string

  description: string

  ownerId: number

  categoriesIds: number[]

  vacantions?: Omit<CreateVacantionDto, 'projectId'>[]
}

@InputType()
class CreateProjectVacantionInput implements Omit<CreateVacantionInput, 'projectId'> {
  @Field()
  title: string

  @Field()
  description: string
}

@InputType()
export class CreateProjectInput
  implements Omit<ProjectEntity, 'id' | 'ownerId' | 'owner' | 'vacantions' | 'categories'> {
  @Field()
  title: string

  @Field()
  description: string

  @Field(() => [Number])
  categoriesIds: number[]

  @Field(() => [CreateProjectVacantionInput], { nullable: true })
  vacantions?: CreateProjectVacantionInput[]
}
