import { omit } from 'lodash'
import {
  Arg,
  Authorized,
  Ctx,
  Mutation,
  Query,
  Resolver,
  ArgsType,
  Field,
  Int,
  Args,
} from 'type-graphql'
import { Context, Delete } from '../app'
import { CreateProjectInput, UpdateProjectInput } from './inputs'
import { Project } from './project.type'
import { ProjectsService } from './projects.service'

const serializeProjectInput = (input: UpdateProjectInput) => ({
  ...omit(input, ['id', 'vacantions']),
  id: Number(input.id),
  vacantions: input.vacantions
    ? input.vacantions.map((v) => ({
        ...omit(v, ['id']),
        id: v.id ? Number(v.id) : undefined,
      }))
    : [],
})

@ArgsType()
class FindProjectsArgs {
  @Field(() => Int, { nullable: true })
  ownerId?: number
}

@Resolver()
export class ProjectsResolver {
  constructor(private projectsService: ProjectsService) {}

  @Query(() => Project, { nullable: true })
  async project(@Arg('id') id: number): Promise<Project | undefined> {
    return this.projectsService.findOne({ id })
  }

  @Query(() => [Project])
  async projects(@Args() args: FindProjectsArgs): Promise<Project[]> {
    return this.projectsService.find(args)
  }

  @Mutation(() => Project)
  @Authorized()
  async createProject(
    @Ctx() ctx: Context,
    @Arg('input') input: CreateProjectInput
  ): Promise<Project> {
    const project = await this.projectsService.create({
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

    const project = await this.projectsService.findOne({
      id,
      ownerId,
    })

    if (!project) {
      return null
    }

    const updatedProject = await this.projectsService.update({
      ...serializeProjectInput(input),
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
