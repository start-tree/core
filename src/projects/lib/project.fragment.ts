import { userFragment } from '../../users'
import { vacantionFragment } from '../../vacantions'
import { createFragment } from '../../app/lib/create-fragment'
import { categoryFragment } from '../../categories'

export const projectFragment = createFragment({
  name: 'projectFields',
  type: 'Project',
  fragments: [userFragment.fragment, vacantionFragment.fragment, categoryFragment.fragment],
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
    categories {
      ...${categoryFragment.name}
    }
  `,
})
