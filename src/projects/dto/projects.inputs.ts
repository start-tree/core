import { InputType, Field } from 'type-graphql'
import { VacantionInput } from '../../vacantions'

@InputType()
export class ProjectInput {
  @Field({ nullable: true })
  id?: number

  @Field()
  title: string

  @Field()
  description: string

  @Field(() => [Number])
  categoriesIds: number[]

  @Field(() => [VacantionInput], { nullable: true })
  vacantions?: VacantionInput[]
}
