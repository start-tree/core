import { CategoryEntity } from '../category.entity'
import { Field } from 'type-graphql'

export class CreateCategoryDto implements Omit<CategoryEntity, 'id'> {
  @Field()
  name: string
}
