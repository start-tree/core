import bcrypt from 'bcrypt'
import { Service } from 'typedi'
import { Repository } from 'typeorm'
import { InjectRepository } from 'typeorm-typedi-extensions'
import { UserEntity } from './user.entity'

export class CreateUser {
  name: string
  email: string
  password: string
}

class FindUser {
  email: string
}

@Service()
export class UsersService {
  constructor(@InjectRepository(UserEntity) readonly userRepo: Repository<UserEntity>) {}

  async createUser(data: CreateUser) {
    return this.userRepo.save({
      name: data.name,
      email: data.email,
      passwordHash: await this.createPassword(data.password),
    })
  }

  async findUser(where: FindUser) {
    return this.userRepo.findOne(where)
  }

  async createPassword(password: string) {
    return bcrypt.hash(password, 10)
  }

  async comparePasswords(password: string, passwordHash: string) {
    return bcrypt.compare(password, passwordHash)
  }
}