import { CreateVacantion } from '../../vacantions'

export interface CreateProject {
  title: string

  description: string

  ownerId: number

  vacantions?: Omit<CreateVacantion, 'projectId'>[]
}
