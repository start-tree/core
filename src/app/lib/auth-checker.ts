import { AuthChecker } from 'type-graphql'
import { Context } from '../interfaces'

export const authChecker: AuthChecker<Context> = ({ context: { authUser } }) => {
  if (!authUser) {
    return false
  }

  return true
}
