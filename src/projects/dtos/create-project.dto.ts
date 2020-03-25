import { Field, InputType } from 'type-graphql'
import { CreateVacantionInput } from '../../vacantions'
import { ProjectEntity } from '../project.entity'
import { CreateVacantionData } from './../../vacantions/dtos/create-vacantion.dto'

export type CreateProjectData = Omit<
  ProjectEntity,
  'id' | 'owner' | 'vacantions' | 'categories'
> & {
  vacantions: Omit<CreateVacantionData, 'projectId'>[]
  categoriesIds: number[]
}

@InputType()
class CreateProjectVacantionInput implements Omit<CreateVacantionInput, 'projectId'> {
  @Field()
  title: string

  @Field()
  description: string
}

@InputType('CreateProjectInput')
export class CreateProjectInput implements Omit<CreateProjectData, 'ownerId' | 'vacantions'> {
  @Field()
  title: string

  @Field()
  description: string

  @Field(() => [Number])
  categoriesIds: number[]

  @Field(() => [CreateProjectVacantionInput], { nullable: true })
  vacantions: Omit<CreateVacantionInput, 'projectId'>[]
}
