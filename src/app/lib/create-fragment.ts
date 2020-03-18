export const createFragment = ({
  name,
  fields,
  type,
  fragments,
}: {
  name: string
  fields: string
  type: string
  fragments?: string[]
}) => {
  return {
    name,
    fragment: `
    fragment ${name} on ${type} {
      ${fields}
    }
    ${fragments ? fragments.join('') : ''}
  `,
  }
}
