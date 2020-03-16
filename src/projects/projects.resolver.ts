import { Arg, Authorized, Mutation, Resolver } from 'type-graphql'
import { CreateProjectInput } from './inputs'
import { Project } from './project.type'
import { ProjectsService } from './projects.service'

@Resolver()
export class ProjectsResolver {
  constructor(private projectsService: ProjectsService) {}

  @Mutation(() => Project)
  @Authorized()
  async createProject(@Arg('data') data: CreateProjectInput): Promise<Project> {
    return this.projectsService.createProject(data)
  }
}
