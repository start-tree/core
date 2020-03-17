import { Field, InputType } from 'type-graphql'
import { Vacantion } from '../vacantion.type'

@InputType()
export class CreateVacantionInput implements Omit<Vacantion, 'project' | 'id'> {
  @Field()
  title: string

  @Field()
  description: string

  @Field()
  projectId: number
}
