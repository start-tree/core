import { Field, InputType } from 'type-graphql'
import { VacantionEntity } from '../vacantion.entity'

export type CreateVacantionData = Omit<VacantionEntity, 'id' | 'project'>

@InputType()
export class CreateVacantionInput implements CreateVacantionData {
  @Field()
  title: string

  @Field()
  description: string
}
