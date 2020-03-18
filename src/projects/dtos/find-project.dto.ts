import { ProjectEntity } from '../project.entity'

export class FindProjectDto implements Partial<Pick<ProjectEntity, 'id' | 'ownerId'>> {
  id?: number

  ownerId?: number
}
