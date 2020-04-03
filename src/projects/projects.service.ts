import { omit } from 'lodash'
import { Service } from 'typedi'
import { FindConditions, In, Repository } from 'typeorm'
import { InjectRepository } from 'typeorm-typedi-extensions'
import { VacantionsService } from '../vacantions'
import {
  FindProjectData,
  FindProjectsData,
  ProjectData,
  CreateProjectInput,
  UpdateProjectInput,
} from './dto'
import { ProjectEntity } from './project.entity'

const makeWhere = ({ ids, ownerId }: FindProjectsData) => {
  const where: FindConditions<ProjectEntity> = {}

  if (ids) {
    where.id = In(ids)
  }

  if (ownerId) {
    where.ownerId = ownerId
  }

  return where
}

export const parseProjectInput = (data: CreateProjectInput | UpdateProjectInput) =>
  omit(data, ['vacantions', 'categoriesIds'])

const getProjectRelationsList = () => ['owner', 'vacantions', 'categories']

@Service()
export class ProjectsService {
  constructor(
    @InjectRepository(ProjectEntity) private projectsRepository: Repository<ProjectEntity>,
    private vacantionsService: VacantionsService
  ) {}

  async create(data: ProjectData) {
    const { id } = await this.projectsRepository.save(
      this.projectsRepository.create(parseProjectInput(data))
    )
    this.projectsRepository.create(parseProjectInput(data))

    {
      const { vacantions } = data
      if (vacantions?.length) {
        await Promise.all(
          vacantions.map((v) => this.vacantionsService.create({ ...v, projectId: id }))
        )
      }
    }

    {
      const { categoriesIds } = data
      if (categoriesIds.length) {
        await this.projectsRepository
          .createQueryBuilder()
          .relation('categories')
          .of(id)
          .add(categoriesIds)
      }
    }

    return await this.findOne({ id })
  }

  async updateById(id: number, data: ProjectData) {
    await this.projectsRepository.save(
      this.projectsRepository.create({ id, ...parseProjectInput(data) })
    )

    {
      const { vacantions } = data
      if (vacantions) {
        await this.vacantionsService.setToProject(vacantions, id)
      }
    }

    {
      const { categoriesIds } = data

      const project = await this.findOne({ id })
      const projectCategories = project!.categories

      await this.projectsRepository
        .createQueryBuilder()
        .relation('categories')
        .of(id)
        .remove(projectCategories)

      await this.projectsRepository
        .createQueryBuilder()
        .relation('categories')
        .of(id)
        .add(categoriesIds)
    }

    return await this.findOne({ id })
  }

  async findOne(where: FindProjectData) {
    return this.projectsRepository.findOne(where, {
      relations: getProjectRelationsList(),
    })
  }

  async find(query: FindProjectsData = {}) {
    return this.projectsRepository.find({
      where: makeWhere(query),
      relations: getProjectRelationsList(),
    })
  }

  async delete(query: FindProjectsData) {
    const { affected } = await this.projectsRepository.delete(makeWhere(query))
    return { affected: affected! }
  }
}
