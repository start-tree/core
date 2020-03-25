import { Field, InputType } from 'type-graphql'
import { CreateVacantionDto, CreateVacantionInput } from '../../vacantions'
import { ProjectEntity } from '../project.entity'

@InputType()
class CreateProjectVacantionInput implements Omit<CreateVacantionInput, 'projectId'> {
  @Field()
  title: string

  @Field()
  description: string
}

@InputType('CreateProjectInput')
export class CreateProjectDto
  implements Omit<ProjectEntity, 'id' | 'owner' | 'vacantions' | 'categories'> {
  @Field()
  title: string

  @Field()
  description: string

  @Field(() => [Number])
  categoriesIds?: number[]

  @Field(() => [CreateProjectVacantionInput], { nullable: true })
  vacantions?: Omit<CreateVacantionDto, 'projectId'>[]

  ownerId: number
}
