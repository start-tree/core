import { Service } from 'typedi'
import { Repository } from 'typeorm'
import { InjectRepository } from 'typeorm-typedi-extensions'
import { CategoryEntity } from './category.entity'
import { CategoryData } from './dto'

@Service()
export class CategoriesService {
  constructor(
    @InjectRepository(CategoryEntity) private categoryRepository: Repository<CategoryEntity>
  ) {}

  async create(data: CategoryData) {
    const { id } = await this.categoryRepository.save(this.categoryRepository.create(data))
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
