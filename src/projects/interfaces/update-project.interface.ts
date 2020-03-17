import { UpdateVacantion } from '../../vacantions'

export interface UpdateProject {
  id: number

  title: string

  description: string

  vacantions: UpdateVacantion[]
}
