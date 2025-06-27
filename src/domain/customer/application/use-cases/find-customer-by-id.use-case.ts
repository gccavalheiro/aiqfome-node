import { Customer } from '../../enterprise/entities/customer'
import { CustomerRepository } from '../repositories/customer-repository'

export interface FindCustomerByIdRequest {
  id: string
}

export interface FindCustomerByIdResponse {
  customer: Customer
}

export class FindCustomerByIdUseCase {
  constructor(private customerRepository: CustomerRepository) {}

  async execute(
    request: FindCustomerByIdRequest,
  ): Promise<FindCustomerByIdResponse> {
    const customer = await this.customerRepository.findById(request.id)

    if (!customer) {
      throw new Error('Customer not found')
    }

    return {
      customer,
    }
  }
}
