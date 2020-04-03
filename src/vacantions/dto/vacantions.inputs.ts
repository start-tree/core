import { InputType, Field, Int } from 'type-graphql'

@InputType()
export class CreateVacantionInput {
  @Field()
  title: string

  @Field()
  description: string
}

@InputType()
export class UpdateVacantionInput extends CreateVacantionInput {
  @Field(() => Int, { nullable: true })
  id?: number
}
