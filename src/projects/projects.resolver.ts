import { omit } from 'lodash'
import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from 'type-graphql'
import { Context, Delete } from '../app'
import { CreateProjectInput, UpdateProjectInput } from './inputs'
import { Project } from './project.type'
import { ProjectsService } from './projects.service'

const serializeProjectInput = (input: UpdateProjectInput) => ({
  ...omit(input, ['id', 'vacantions']),
  id: Number(input.id),
  vacantions: input.vacantions.map((v) => ({
    ...omit(v, ['id']),
    id: v.id ? Number(v.id) : undefined,
  })),
})

@Resolver()
export class ProjectsResolver {
  constructor(private projectsService: ProjectsService) {}

  @Query(() => Project, { nullable: true })
  async project(@Arg('id') id: number): Promise<Project | undefined> {
    return this.projectsService.findProject({ id })
  }

  @Query(() => [Project])
  async projects(): Promise<Project[]> {
    return this.projectsService.findProjects()
  }

  @Mutation(() => Project)
  @Authorized()
  async createProject(
    @Ctx() ctx: Context,
    @Arg('input') input: CreateProjectInput
  ): Promise<Project> {
    const project = await this.projectsService.createProject({
      ...input,
      ownerId: ctx.authUser!.id,
    })
    return project!
  }

  @Mutation(() => Project, { nullable: true })
  @Authorized()
  async updateProject(
    @Ctx() ctx: Context,
    @Arg('input') input: UpdateProjectInput
  ): Promise<Project | null> {
    const ownerId = ctx.authUser!.id
    const id = Number(input.id)

    const project = await this.projectsService.findProject({
      id,
      ownerId,
    })

    if (!project) {
      return null
    }

    const updatedProject = await this.projectsService.updateProject({
      ...serializeProjectInput(input),
      ownerId,
    })

    return updatedProject!
  }

  @Mutation(() => Delete)
  @Authorized()
  async deleteProject(@Ctx() ctx: Context, @Arg('id') id: number): Promise<Delete> {
    return this.projectsService.deleteProject({
      ids: [id],
      ownerId: ctx.authUser!.id,
    })
  }
}
