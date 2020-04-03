import { Service } from 'typedi'
import { InjectRepository } from 'typeorm-typedi-extensions'
import { ProposalEntity } from './proposal.entity'
import { Repository } from 'typeorm'

export class ProposalData {
  description: string

  vacantionId: number

  userId: number
}

@Service()
export class ProposalsService {
  constructor(
    @InjectRepository(ProposalEntity) private proposalRepository: Repository<ProposalEntity>
  ) {}

  async create(data: ProposalData) {
    const { id } = await this.proposalRepository.save(this.proposalRepository.create(data))
    return this.findOne({ id })
  }

  async findOne({ id }: { id?: number }) {
    return this.proposalRepository.findOne({ id }, { relations: ['vacantion', 'user'] })
  }
}
