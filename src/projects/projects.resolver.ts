import { ProjectEntity } from './project.entity'
import { Arg, Args, Authorized, Ctx, Mutation, Query, Resolver } from 'type-graphql'
import { Context, Delete } from '../app'
import { CreateProjectInput, FindProjectsArgs, UpdateProjectInput } from './dtos'
import { ProjectsService } from './projects.service'

@Resolver()
export class ProjectsResolver {
  constructor(private projectsService: ProjectsService) {}

  @Query(() => ProjectEntity, { nullable: true })
  async project(@Arg('id') id: number): Promise<ProjectEntity | undefined> {
    return this.projectsService.findOne({ id })
  }

  @Query(() => [ProjectEntity])
  async projects(@Args() args: FindProjectsArgs): Promise<ProjectEntity[]> {
    return this.projectsService.find(args)
  }

  @Mutation(() => ProjectEntity)
  @Authorized()
  async createProject(
    @Ctx() ctx: Context,
    @Arg('input') input: CreateProjectInput
  ): Promise<ProjectEntity> {
    const project = await this.projectsService.create({
      ...input,
      ownerId: ctx.authUser!.id,
    })
    return project!
  }

  @Mutation(() => ProjectEntity, { nullable: true })
  @Authorized()
  async updateProject(
    @Ctx() ctx: Context,
    @Arg('input') input: UpdateProjectInput
  ): Promise<ProjectEntity | null> {
    const ownerId = ctx.authUser!.id
    const id = Number(input.id)

    const project = await this.projectsService.findOne({
      id,
      ownerId,
    })

    if (!project) {
      return null
    }

    const updatedProject = await this.projectsService.update({
      ...input,
      ownerId,
    })

    return updatedProject!
  }

  @Mutation(() => Delete)
  @Authorized()
  async deleteProject(@Ctx() ctx: Context, @Arg('id') id: number): Promise<Delete> {
    return this.projectsService.delete({
      ids: [id],
      ownerId: ctx.authUser!.id,
    })
  }
}
