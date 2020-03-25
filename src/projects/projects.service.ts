import { omit } from 'lodash'
import { Service } from 'typedi'
import { FindConditions, In, Repository } from 'typeorm'
import { InjectRepository } from 'typeorm-typedi-extensions'
import { VacantionsService } from '../vacantions'
import { CreateProjectDto, FindProjectDto, FindProjectsDto, UpdateProjectDto } from './dtos'
import { ProjectEntity } from './project.entity'

const makeWhere = ({ ids, ownerId }: FindProjectsDto) => {
  const where: FindConditions<ProjectEntity> = {}

  if (ids) {
    where.id = In(ids)
  }

  if (ownerId) {
    where.ownerId = ownerId
  }

  return where
}

@Service()
export class ProjectsService {
  constructor(
    @InjectRepository(ProjectEntity) private projectsRepository: Repository<ProjectEntity>,
    private vacantionsService: VacantionsService
  ) {}

  async create(data: CreateProjectDto) {
    const { id } = await this.projectsRepository.save(omit(data, ['vacantions']))

    const { vacantions } = data
    if (vacantions) {
      await Promise.all(
        vacantions.map((v) => this.vacantionsService.create({ ...v, projectId: id }))
      )
    }

    const { categoriesIds } = data
    await this.projectsRepository
      .createQueryBuilder()
      .relation('categories')
      .of(id)
      .add(categoriesIds)

    return await this.findOne({ id })
  }

  async update(data: UpdateProjectDto) {
    const { id } = await this.projectsRepository.save(omit(data, ['vacantions']))

    const { vacantions } = data
    if (vacantions) {
      await this.vacantionsService.saveForProject(vacantions, id)
    }

    return await this.findOne({ id })
  }

  async findOne(where: FindProjectDto) {
    return this.projectsRepository.findOne(where, {
      relations: ['owner', 'vacantions', 'categories'],
    })
  }

  async find(query: FindProjectsDto = {}) {
    return this.projectsRepository.find({
      where: makeWhere(query),
      relations: ['owner', 'vacantions', 'categories'],
    })
  }

  async delete(query: FindProjectsDto) {
    const { affected } = await this.projectsRepository.delete(makeWhere(query))
    return { affected: affected! }
  }
}
