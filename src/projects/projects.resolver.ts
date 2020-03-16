import { omit } from 'lodash'
import { Arg, Authorized, Mutation, Query, Resolver, Ctx } from 'type-graphql'
import { CreateProjectInput, UpdateProjectInput } from './inputs'
import { Project } from './project.type'
import { ProjectsService } from './projects.service'
import { Context } from '../app'

@Resolver()
export class ProjectsResolver {
  constructor(private projectsService: ProjectsService) {}

  @Mutation(() => Project)
  @Authorized()
  async createProject(
    @Ctx() ctx: Context,
    @Arg('data') data: CreateProjectInput
  ): Promise<Project> {
    const project = await this.projectsService.createProject({ ...data, ownerId: ctx.authUser!.id })
    return project!
  }

  @Mutation(() => Project)
  @Authorized()
  async updateProject(
    @Ctx() ctx: Context,
    @Arg('data') data: UpdateProjectInput
  ): Promise<Project> {
    // TODO: check ctx.user.id === project.ownerId
    const project = await this.projectsService.updateProject(parseInt(data.id, 10), {
      ...omit(data, ['id']),
      ownerId: ctx.authUser!.id,
    })
    return project!
  }

  @Query(() => Project, { nullable: true })
  async project(@Arg('id') id: string): Promise<Project | undefined> {
    return this.projectsService.findProject({ id: parseInt(id, 10) })
  }
}
