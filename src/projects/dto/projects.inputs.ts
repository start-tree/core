import { Field, InputType, Int } from 'type-graphql'
import { CreateVacantionInput, UpdateVacantionInput } from '../../vacantions'

@InputType()
export class CreateProjectInput {
  @Field()
  title: string

  @Field()
  description: string

  @Field(() => [Int])
  categoriesIds: number[]

  @Field(() => [CreateVacantionInput], { nullable: true })
  vacantions?: CreateVacantionInput[]
}

@InputType()
export class UpdateProjectInput extends CreateProjectInput {
  @Field(() => Int)
  id: number

  @Field(() => [UpdateVacantionInput], { nullable: true })
  vacantions?: UpdateVacantionInput[]
}
