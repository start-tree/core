import { ProjectEntity } from '../project.entity'

export class FindProjectsDto implements Partial<Pick<ProjectEntity, 'id' | 'ownerId'>> {
  ids?: number[]

  ownerId?: number
}
