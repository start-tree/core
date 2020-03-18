import { omit } from 'lodash'
import { Service } from 'typedi'
import { FindConditions, In, Repository } from 'typeorm'
import { InjectRepository } from 'typeorm-typedi-extensions'
import { VacantionsService } from '../vacantions'
import { CreateProjectDto, FindProjectDto, UpdateProjectDto } from './dtos'
import { ProjectEntity } from './project.entity'
import { FindProjectsDto } from './dtos/find-projects.dto'

@Service()
export class ProjectsService {
  constructor(
    @InjectRepository(ProjectEntity) private projectsRepo: Repository<ProjectEntity>,
    private vacantionsService: VacantionsService
  ) {}

  async createProject(data: CreateProjectDto) {
    const { id } = await this.projectsRepo.save(omit(data, ['vacantions']))

    const { vacantions } = data

    if (vacantions) {
      await Promise.all(
        vacantions.map((v) => this.vacantionsService.createVacantion({ ...v, projectId: id }))
      )
    }

    return this.findProject({ id })
  }

  async updateProject(data: UpdateProjectDto) {
    const { id } = await this.projectsRepo.save({
      ...omit(data, ['vacantions']),
    })

    const { vacantions } = data
    // find removed vacantions -> delete from db
    const existedVacantions = await this.vacantionsService.findVacantions({ projectId: id })
    const vacantionsIdsToDelete = existedVacantions
      .filter((ev) => !vacantions.some((v) => v.id === ev.id))
      .map((v) => v.id)
    await this.vacantionsService.deleteVacantions({ ids: vacantionsIdsToDelete })
    // find updated vacantions -> update in db
    const vacantionsToUpdate = vacantions.filter((v) => v.id)
    await Promise.all(vacantionsToUpdate.map((v) => this.vacantionsService.updateVacantion(v)))

    // find new vacantions -> create in db
    const vacantionsToCreate = vacantions.filter((v) => !v.id)
    await Promise.all(
      vacantionsToCreate.map((v) => this.vacantionsService.createVacantion({ ...v, projectId: id }))
    )

    return this.findProject({ id })
  }

  async findProject(where: FindProjectDto) {
    return this.projectsRepo.findOne(where, { relations: ['owner', 'vacantions'] })
  }

  async findProjects({ ids, ownerId }: FindProjectsDto = {}) {
    const where: FindConditions<ProjectEntity> = {}

    if (ids) {
      where.id = In(ids)
    }

    if (ownerId) {
      where.ownerId = ownerId
    }

    return this.projectsRepo.find({ relations: ['owner', 'vacantions'] })
  }

  async deleteProject({ ids, ownerId }: FindProjectsDto) {
    const where: FindConditions<ProjectEntity> = {}

    if (ids) {
      where.id = In(ids)
    }

    if (ownerId) {
      where.ownerId = ownerId
    }

    const { affected } = await this.projectsRepo.delete(where)

    return { affected }
  }
}
