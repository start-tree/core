import { userFragment } from '../../users'
import { vacantionFragment } from '../../vacantions'
import { createFragment } from '../../app/lib/create-fragment'

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
