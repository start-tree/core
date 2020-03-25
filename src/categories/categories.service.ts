import { Service } from 'typedi'
import { InjectRepository } from 'typeorm-typedi-extensions'
import { CategoryEntity } from './category.entity'
import { Repository } from 'typeorm'
import { CreateCategoryDto } from './dtos'

@Service()
export class CategoriesService {
  constructor(
    @InjectRepository(CategoryEntity) private categoryRepository: Repository<CategoryEntity>
  ) {}

  async create(data: CreateCategoryDto) {
    const { id } = await this.categoryRepository.save(data)
    const category = await this.findOne({ id })
    return category!
  }

  async findOne({ id }: { id: number }) {
    return this.categoryRepository.findOne({ id })
  }

  async find() {
    return this.categoryRepository.find()
  }
}
