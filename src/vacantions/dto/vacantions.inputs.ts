import { InputType, Field } from 'type-graphql'

@InputType()
export class CreateVacantionInput {
  @Field()
  title: string

  @Field()
  description: string
}

@InputType()
export class UpdateVacantionInput extends CreateVacantionInput {
  @Field({ nullable: true })
  id?: number
}
