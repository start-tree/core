import {
  Arg,
  Args,
  Authorized,
  Ctx,
  Mutation,
  Query,
  Resolver,
  Int,
  InputType,
  Field,
} from 'type-graphql'
import { Context, Delete } from '../app'
import { CreateProjectInput, FindProjectsArgs, UpdateProjectInput } from './dto'
import { ProjectEntity } from './project.entity'
import { ProjectsService } from './projects.service'
import { ProposalEntity } from './proposal.entity'
import { ProposalsService } from './proposals.service'

@InputType()
export class AddProposalInput {
  @Field()
  description: string

  @Field(() => Int)
  vacantionId: number
}

@Resolver()
export class ProjectsResolver {
  constructor(
    private projectsService: ProjectsService,
    private proposalsService: ProposalsService
  ) {}

  @Query(() => ProjectEntity, { nullable: true })
  async project(@Arg('id', () => Int) id: number): Promise<ProjectEntity | undefined> {
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

    const updatedProject = await this.projectsService.updateById(id, {
      ...input,
      ownerId,
    })

    return updatedProject!
  }

  @Mutation(() => Delete)
  @Authorized()
  async deleteProject(@Ctx() ctx: Context, @Arg('id', () => Int) id: number): Promise<Delete> {
    return this.projectsService.delete({
      ids: [id],
      ownerId: ctx.authUser!.id,
    })
  }

  @Mutation(() => ProposalEntity)
  @Authorized()
  addProposal(@Ctx() ctx: Context, @Arg('input') input: AddProposalInput) {
    return this.proposalsService.create({
      ...input,
      userId: ctx.authUser!.id,
    })
  }
}
