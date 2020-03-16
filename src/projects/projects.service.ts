import { Service } from 'typedi'
import { Repository } from 'typeorm'
import { InjectRepository } from 'typeorm-typedi-extensions'
import { CreateProject, FindProject } from './interfaces'
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

  async findProject(where: FindProject) {
    return this.projectsRepo.findOne(where, { relations: ['owner'] })
  }
}
