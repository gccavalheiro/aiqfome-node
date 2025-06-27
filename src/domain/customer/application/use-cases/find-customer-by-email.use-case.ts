import { Customer } from '../../enterprise/entities/customer'
import { CustomerRepository } from '../repositories/customer-repository'

export interface FindCustomerByEmailRequest {
  email: string
}

export interface FindCustomerByEmailResponse {
  customer: Customer | null
}

export class FindCustomerByEmailUseCase {
  constructor(private customerRepository: CustomerRepository) {}

  async execute(
    request: FindCustomerByEmailRequest,
  ): Promise<FindCustomerByEmailResponse> {
    const customer = await this.customerRepository.findByEmail(request.email)

    return {
      customer,
    }
  }
} 