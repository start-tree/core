import { Field, InputType } from 'type-graphql'
import { CreateVacantionData } from './create-vacantion.dto'
import { VacantionEntity } from '../vacantion.entity'

export type UpdateVacantionData = CreateVacantionData & Partial<Pick<VacantionEntity, 'id'>>

@InputType()
export class UpdateVacantionInput implements UpdateVacantionData {
  @Field({ nullable: true })
  id?: number

  @Field()
  title: string

  @Field()
  description: string
}
