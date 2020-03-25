import { Field, InputType } from 'type-graphql'
import { VacantionEntity } from '../vacantion.entity'
import { Vacantion } from '../vacantion.type'

export class CreateVacantionDto implements Omit<VacantionEntity, 'id' | 'project'> {
  title: string

  description: string

  projectId: number
}

@InputType()
export class CreateVacantionInput implements Omit<Vacantion, 'project' | 'id'> {
  @Field()
  title: string

  @Field()
  description: string

  @Field()
  projectId: number
}
