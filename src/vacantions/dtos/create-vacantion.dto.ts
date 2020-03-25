import { Field, InputType } from 'type-graphql'
import { VacantionEntity } from '../vacantion.entity'

export class CreateVacantionDto implements Omit<VacantionEntity, 'id' | 'project'> {
  title: string

  description: string

  projectId: number
}

@InputType()
export class CreateVacantionInput implements Omit<VacantionEntity, 'project' | 'id'> {
  @Field()
  title: string

  @Field()
  description: string

  @Field()
  projectId: number
}
