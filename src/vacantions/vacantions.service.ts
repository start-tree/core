import { Service } from 'typedi'
import { Repository } from 'typeorm'
import { InjectRepository } from 'typeorm-typedi-extensions'
import { CreateVacantion, FindVacantion } from './interfaces'
import { VacantionEntity } from './vacantion.entity'

@Service()
export class VacantionsService {
  constructor(
    @InjectRepository(VacantionEntity) private projectsRepo: Repository<VacantionEntity>
  ) {}

  async createVacantion(data: CreateVacantion) {
    const { id } = await this.projectsRepo.save(data)
    return this.findVacantion({ id })
  }

  async findVacantion(where: FindVacantion) {
    return this.projectsRepo.findOne(where, { relations: ['project'] })
  }
}
