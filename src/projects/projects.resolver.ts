import { omit } from 'lodash'
import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from 'type-graphql'
import { Context, Delete } from '../app'
import { CreateProjectInput, UpdateProjectInput } from './inputs'
import { Project } from './project.type'
import { ProjectsService } from './projects.service'

const serializeProject = (data: UpdateProjectInput) => ({
  id: parseInt(data.id, 10),
  ...omit(data, ['id', 'vacantions']),
  vacantions: data.vacantions.map((v) => ({ ...v, id: v.id ? parseInt(v.id, 10) : undefined })),
})

@Resolver()
export class ProjectsResolver {
  constructor(private projectsService: ProjectsService) {}

  @Query(() => Project, { nullable: true })
  async project(@Arg('id') id: string): Promise<Project | undefined> {
    return this.projectsService.findProject({ id: parseInt(id, 10) })
  }

  @Query(() => [Project])
  async projects(): Promise<Project[]> {
    return this.projectsService.findProjects()
  }

  @Mutation(() => Project)
  @Authorized()
  async createProject(
    @Ctx() ctx: Context,
    @Arg('data') data: CreateProjectInput
  ): Promise<Project> {
    const project = await this.projectsService.createProject({ ...data, ownerId: ctx.authUser!.id })
    return project!
  }

  @Mutation(() => Project, { nullable: true })
  @Authorized()
  async updateProject(
    @Ctx() ctx: Context,
    @Arg('data') data: UpdateProjectInput
  ): Promise<Project | null> {
    const project = await this.projectsService.findProject({
      id: parseInt(data.id, 10),
      ownerId: ctx.authUser!.id,
    })

    if (!project) {
      return null
    }

    const updatedProject = await this.projectsService.updateProject(serializeProject(data))
    return updatedProject!
  }

  @Mutation(() => Delete)
  @Authorized()
  async deleteProject(@Ctx() ctx: Context, @Arg('id') id: string): Promise<Delete> {
    return this.projectsService.deleteProject({
      ids: [parseInt(id, 10)],
      ownerId: ctx.authUser!.id,
    })
  }
}
