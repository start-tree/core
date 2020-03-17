import { Service } from 'typedi'
import { FindConditions, In, Repository } from 'typeorm'
import { InjectRepository } from 'typeorm-typedi-extensions'
import { CreateVacantion, FindVacantion, UpdateVacantion } from './interfaces'
import { VacantionEntity } from './vacantion.entity'

@Service()
export class VacantionsService {
  constructor(
    @InjectRepository(VacantionEntity) private vacantionsRepo: Repository<VacantionEntity>
  ) {}

  async createVacantion(data: CreateVacantion) {
    const { id } = await this.vacantionsRepo.save(data)
    return this.findVacantion({ id })
  }

  async updateVacantion(data: UpdateVacantion) {
    const { id } = await this.vacantionsRepo.save(data)
    return this.findVacantion({ id })
  }

  async findVacantion(where: FindVacantion) {
    return this.vacantionsRepo.findOne(where, { relations: ['project'] })
  }

  async findVacantions({ ids, projectId }: { ids?: number[]; projectId?: number } = {}) {
    const where: FindConditions<VacantionEntity> = {}

    if (ids) {
      where.id = In(ids)
    }

    if (projectId) {
      where.projectId = projectId
    }

    return this.vacantionsRepo.find({ where })
  }

  async deleteVacantions({ ids }: { ids: number[] }) {
    const where: FindConditions<VacantionEntity> = {}

    if (ids) {
      where.id = In(ids)
    }

    const { affected } = await this.vacantionsRepo.delete(where)

    return Boolean(affected)
  }
}
