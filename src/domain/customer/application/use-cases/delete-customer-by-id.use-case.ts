import { CustomerRepository } from '../repositories/customer-repository'

export interface DeleteCustomerByIdRequest {
  id: string
}

export class DeleteCustomerByIdUseCase {
  constructor(private customerRepository: CustomerRepository) {}

  async execute(request: DeleteCustomerByIdRequest): Promise<void> {
    const customer = await this.customerRepository.findById(request.id)

    if (!customer) {
      throw new Error('Customer not found')
    }

    await this.customerRepository.delete(request.id)
  }
}
