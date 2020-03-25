import bcrypt from 'bcrypt'
import { omit } from 'lodash'
import { Service } from 'typedi'
import { Repository } from 'typeorm'
import { InjectRepository } from 'typeorm-typedi-extensions'
import { CreateUserDto, FindUserDto } from './dtos'
import { UserEntity } from './user.entity'

@Service()
export class UsersService {
  constructor(@InjectRepository(UserEntity) private userRepository: Repository<UserEntity>) {}

  async create(data: CreateUserDto) {
    return this.userRepository.save({
      ...omit(data, ['passwordHash']),
      passwordHash: await this.createPassword(data.password),
    })
  }

  async findOne(where: FindUserDto) {
    return this.userRepository.findOne(where)
  }

  async createPassword(password: string) {
    return bcrypt.hash(password, 10)
  }

  async comparePasswords(password: string, passwordHash: string) {
    return bcrypt.compare(password, passwordHash)
  }
}
