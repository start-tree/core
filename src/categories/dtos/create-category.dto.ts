import { CategoryEntity } from '../category.entity'

export type CreateCategoryData = Omit<CategoryEntity, 'id'>
