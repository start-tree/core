import { omit } from 'lodash'
import { Service } from 'typedi'
import { FindConditions, In, Repository } from 'typeorm'
import { InjectRepository } from 'typeorm-typedi-extensions'
import { VacantionsService } from '../vacantions'
import { CreateProject, FindProject, UpdateProject } from './interfaces'
import { ProjectEntity } from './project.entity'

@Service()
export class ProjectsService {
  constructor(
    @InjectRepository(ProjectEntity) private projectsRepo: Repository<ProjectEntity>,
    private vacantionsService: VacantionsService
  ) {}

  async createProject(data: CreateProject) {
    const { id } = await this.projectsRepo.save(omit(data, ['vacantions']))

    const { vacantions } = data

    if (vacantions) {
      await Promise.all(
        vacantions.map((v) => this.vacantionsService.createVacantion({ ...v, projectId: id }))
      )
    }

    return this.findProject({ id })
  }

  async updateProject(data: UpdateProject) {
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

  async findProject(where: FindProject) {
    return this.projectsRepo.findOne(where, { relations: ['owner', 'vacantions'] })
  }

  async findProjects() {
    return this.projectsRepo.find({ relations: ['owner', 'vacantions'] })
  }

  async deleteProject({ ids, ownerId }: { ids?: number[]; ownerId?: number }) {
    const where: FindConditions<ProjectEntity> = {}

    if (ids) {
      where.id = In(ids)
    }

    if (ownerId) {
      where.ownerId = ownerId
    }

    const { affected } = await this.projectsRepo.delete(where)

    return Boolean(affected)
  }
}
