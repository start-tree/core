import { Service } from 'typedi'
import { sign, verify, JsonWebTokenError } from 'jsonwebtoken'

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
