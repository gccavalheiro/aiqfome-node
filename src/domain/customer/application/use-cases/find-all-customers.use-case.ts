import { Customer } from '../../enterprise/entities/customer'
import { CustomerRepository } from '../repositories/customer-repository'

export interface FindAllCustomersResponse {
  customers: Customer[]
}

export class FindAllCustomersUseCase {
  constructor(private customerRepository: CustomerRepository) {}

  async execute(): Promise<FindAllCustomersResponse> {
    const customers = await this.customerRepository.findAll()

    return {
      customers,
    }
  }
}
