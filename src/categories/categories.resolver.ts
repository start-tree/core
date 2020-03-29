import { Resolver, Query } from 'type-graphql'
import { CategoriesService } from './categories.service'
import { CategoryEntity } from './category.entity'

@Resolver()
export class CategoriesResolver {
  constructor(private categoriesService: CategoriesService) {}

  @Query(() => [CategoryEntity])
  categories(): Promise<CategoryEntity[]> {
    return this.categoriesService.find()
  }
}
