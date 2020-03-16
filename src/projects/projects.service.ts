import { Service } from 'typedi'
import { Repository } from 'typeorm'
import { InjectRepository } from 'typeorm-typedi-extensions'
import { CreateProject, FindProject, UpdateProject } from './interfaces'
import { ProjectEntity } from './project.entity'

@Service()
export class ProjectsService {
  constructor(@InjectRepository(ProjectEntity) private projectsRepo: Repository<ProjectEntity>) {}

  async createProject(data: CreateProject) {
    const { id } = await this.projectsRepo.save({
      title: data.title,
      description: data.description,
      ownerId: data.ownerId,
    })

    return this.findProject({ id })
  }

  async updateProject(iId: number, data: UpdateProject) {
    const { id } = await this.projectsRepo.save({
      id: iId,
      title: data.title,
      description: data.description,
      ownerId: data.ownerId,
    })

    return this.findProject({ id })
  }

  async findProject(where: FindProject) {
    return this.projectsRepo.findOne(where, { relations: ['owner'] })
  }

  async deleteProject({ id, ownerId }: { id: number; ownerId: number }) {
    const { affected } = await this.projectsRepo.delete({ id, ownerId })
    return Boolean(affected)
  }
}
