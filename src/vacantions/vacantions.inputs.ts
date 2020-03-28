import { InputType, Field } from 'type-graphql'

@InputType()
export class VacantionInput {
  @Field({ nullable: true })
  id?: number

  @Field()
  title: string

  @Field()
  description: string
}
