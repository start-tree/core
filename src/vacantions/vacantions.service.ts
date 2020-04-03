import { Service } from 'typedi'
import { omit } from 'lodash'
import { FindConditions, In, Repository } from 'typeorm'
import { InjectRepository } from 'typeorm-typedi-extensions'
import { FindVacantionData, FindVacantionsData, VacationData } from './dto'
import { VacantionEntity } from './vacantion.entity'
import { ProjectVacantionData } from '../projects'

const getVacantionRelationsList = () => ['project']

@Service()
export class VacantionsService {
  constructor(
    @InjectRepository(VacantionEntity) private vacantionsRepository: Repository<VacantionEntity>
  ) {}

  async create(data: VacationData) {
    const { id } = await this.vacantionsRepository.save(this.vacantionsRepository.create(data))
    return this.findOne({ id })
  }

  async updateById(id: number, data: VacationData) {
    await this.vacantionsRepository.save(this.vacantionsRepository.create({ id, ...data }))
    return this.findOne({ id })
  }

  async findOne(where: FindVacantionData) {
    return this.vacantionsRepository.findOne(where, { relations: getVacantionRelationsList() })
  }

  async find({ ids, projectId }: { ids?: number[]; projectId?: number } = {}) {
    const where: FindConditions<VacantionEntity> = {}

    if (ids) {
      where.id = In(ids)
    }

    if (projectId) {
      where.projectId = projectId
    }

    return this.vacantionsRepository.find({ where, relations: getVacantionRelationsList() })
  }

  async delete({ ids }: FindVacantionsData) {
    const where: FindConditions<VacantionEntity> = {}

    if (ids) {
      where.id = In(ids)
    }

    const { affected } = await this.vacantionsRepository.delete(where)
    return Boolean(affected)
  }

  async setToProject(data: ProjectVacantionData[], projectId: number) {
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
    await Promise.all(vacantionsToUpdate.map((v) => this.updateById(v.id!, omit(v, ['id']))))
  }
}
