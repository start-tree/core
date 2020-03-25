import { Service } from 'typedi'
import { FindConditions, In, Repository } from 'typeorm'
import { InjectRepository } from 'typeorm-typedi-extensions'
import { CreateVacantionDto, FindVacantionDto, UpdateVacantionDto } from './dtos'
import { VacantionEntity } from './vacantion.entity'

@Service()
export class VacantionsService {
  constructor(
    @InjectRepository(VacantionEntity) private vacantionsRepo: Repository<VacantionEntity>
  ) {}

  async create(data: CreateVacantionDto) {
    const { id } = await this.vacantionsRepo.save(data)
    return this.findOne({ id })
  }

  async update(data: UpdateVacantionDto) {
    const { id } = await this.vacantionsRepo.save(data)
    return this.findOne({ id })
  }

  async findOne(where: FindVacantionDto) {
    return this.vacantionsRepo.findOne(where, { relations: ['project'] })
  }

  async find({ ids, projectId }: { ids?: number[]; projectId?: number } = {}) {
    const where: FindConditions<VacantionEntity> = {}

    if (ids) {
      where.id = In(ids)
    }

    if (projectId) {
      where.projectId = projectId
    }

    return this.vacantionsRepo.find({ where })
  }

  async delete({ ids }: { ids: number[] }) {
    const where: FindConditions<VacantionEntity> = {}

    if (ids) {
      where.id = In(ids)
    }

    const { affected } = await this.vacantionsRepo.delete(where)
    return Boolean(affected)
  }

  async saveForProject(data: UpdateVacantionDto[], projectId: number) {
    const existedVacantions = await this.find({ projectId })

    const vacantionsIdsToDelete = existedVacantions
      .filter((ev) => !data.some((v) => v.id === ev.id))
      .map((v) => v.id)
    if (vacantionsIdsToDelete.length) {
      await this.delete({ ids: vacantionsIdsToDelete })
    }

    const vacantionsToCreate = data.filter((v) => !v.id)
    if (vacantionsToCreate.length) {
      await Promise.all(vacantionsToCreate.map((v) => this.create({ ...v, projectId })))
    }

    const vacantionsToUpdate = data.filter((v) => v.id)
    await Promise.all(vacantionsToUpdate.map((v) => this.update(v)))
  }
}
