# TODO

## Categories

- [x] Add category entity
- [x] Fake categories
- [x] Add fake categories to projects
- [ ] Add categories to create project mutation
- [ ] Add categories to update project mutation
- [ ] Add categories to find project query
- [ ] Add categories to find projects query

- [ ] add categoeries resolver, categories query

- [ ] Refactor fake db

- [ ] Make generic dto/input with abilly to add fields

```ts
@InputType('CreateProjectInput')
export class CreateProjectDto
  implements Omit<ProjectEntity, 'id' | 'owner' | 'vacantions' | 'categories'> {
  @Field()
  title: string

  @Field()
  description: string

  @Field(() => [Number])
  categoriesIds: number[]

  @Field(() => [CreateProjectVacantionInput], { nullable: true })
  vacantions?: Omit<CreateVacantionDto, 'projectId'>[]

  ownerId: number
}

// split above class to 2

// 1) in resolver
@InputType('CreateProjectInput')
export class CreateProjectDto
  implements Omit<ProjectEntity, 'id' | 'owner' | 'vacantions' | 'categories'> {
  @Field()
  title: string

  @Field()
  description: string

  @Field(() => [Number])
  categoriesIds: number[]

  @Field(() => [CreateProjectVacantionInput], { nullable: true })
  vacantions?: Omit<CreateVacantionDto, 'projectId'>[]
}

// 2) in service
dto: CreateProjectDto & { ownerId: number }
```
