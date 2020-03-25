import { Field, InputType } from 'type-graphql'
import { CreateVacantionDto, CreateVacantionInput } from './create-vacantion.dto'

export class UpdateVacantionDto implements Omit<CreateVacantionDto, 'projectId'> {
  id?: number

  title: string

  description: string

  projectId?: number
}

@InputType()
export class UpdateVacantionInput implements Omit<CreateVacantionInput, 'project' | 'id'> {
  @Field({ nullable: true })
  id: number

  @Field()
  title: string

  @Field()
  description: string

  @Field()
  projectId: number
}
