import { Field, InputType } from 'type-graphql'
import { CreateVacantionInput, UpdateVacantionInput } from '../../vacantions'

@InputType()
export class CreateProjectInput {
  @Field()
  title: string

  @Field()
  description: string

  @Field(() => [Number])
  categoriesIds: number[]

  @Field(() => [CreateVacantionInput], { nullable: true })
  vacantions?: CreateVacantionInput[]
}

@InputType()
export class UpdateProjectInput extends CreateProjectInput {
  @Field()
  id: number

  @Field(() => [UpdateVacantionInput], { nullable: true })
  vacantions?: UpdateVacantionInput[]
}
