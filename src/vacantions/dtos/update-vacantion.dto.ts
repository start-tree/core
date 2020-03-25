import { Field, InputType } from 'type-graphql'
import { Vacantion } from '../vacantion.type'
import { CreateVacantionDto } from './create-vacantion.dto'

export class UpdateVacantionDto implements Omit<CreateVacantionDto, 'projectId'> {
  id?: number

  title: string

  description: string

  projectId?: number
}

@InputType()
export class UpdateVacantionInput implements Omit<Vacantion, 'project' | 'id'> {
  @Field({ nullable: true })
  id: number

  @Field()
  title: string

  @Field()
  description: string

  @Field()
  projectId: number
}
