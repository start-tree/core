import { Service } from 'typedi'
import { sign } from 'jsonwebtoken'

@Service()
export class AuthServie {
  createToken(id: number) {
    return sign({ id }, 'secret')
  }
}
