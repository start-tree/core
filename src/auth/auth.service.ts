import { sign, verify } from 'jsonwebtoken'
import { Service } from 'typedi'

@Service()
export class AuthService {
  createToken(id: number) {
    return sign({ id }, 'secret')
  }

  verifyToken(authorization: string) {
    const token = authorization.split(' ')[1]

    return verify(token, 'secret') as { id: number }
  }
}
