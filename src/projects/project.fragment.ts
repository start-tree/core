import { createFragment } from './../app/lib'
import { userFragment } from '../users'
import { vacantionFragment } from '../vacantions'

export const projectFragment = createFragment({
  name: 'projectFields',
  type: 'Project',
  fragments: [userFragment.fragment, vacantionFragment.fragment],
  fields: `
    id
    title
    description
    ownerId
    owner {
      ...${userFragment.name}
    }
    vacantions {
      ...${vacantionFragment.name}
    }
  `,
})
