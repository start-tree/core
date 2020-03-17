import { Field, InputType, ID } from 'type-graphql'
import { Vacantion } from '../vacantion.type'

@InputType()
export class UpdateVacantionInput implements Omit<Vacantion, 'project' | 'id'> {
  @Field(() => ID)
  id: string

  @Field()
  title: string

  @Field()
  description: string

  @Field()
  projectId: number
}
