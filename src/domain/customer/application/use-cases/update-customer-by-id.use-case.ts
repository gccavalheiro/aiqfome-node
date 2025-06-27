import { Customer } from '../../enterprise/entities/customer'
import { CustomerRepository } from '../repositories/customer-repository'
import { CustomerUpdatedEvent } from '../../enterprise/events/customer-updated.event'

export interface UpdateCustomerByIdRequest {
  id: string
  name?: string
  email?: string
  password?: string
}

export interface UpdateCustomerByIdResponse {
  customer: Customer
  event: CustomerUpdatedEvent
}

export class UpdateCustomerByIdUseCase {
  constructor(private customerRepository: CustomerRepository) {}

  async execute(
    request: UpdateCustomerByIdRequest,
  ): Promise<UpdateCustomerByIdResponse> {
    const customer = await this.customerRepository.findById(request.id)

    if (!customer) {
      throw new Error('Customer not found')
    }

    if (request.email && request.email !== customer.email) {
      const existingCustomer = await this.customerRepository.findByEmail(
        request.email,
      )

      if (existingCustomer) {
        throw new Error('Customer with this email already exists')
      }
    }

    if (request.name) {
      customer.name = request.name
    }

    if (request.email) {
      customer.email = request.email
    }

    if (request.password) {
      customer.setPassword(request.password)
    }

    await this.customerRepository.update(customer)

    const event = new CustomerUpdatedEvent(
      customer.id.toString(),
      customer.name,
      customer.email,
      customer.updatedAt ?? new Date(),
    )

    return {
      customer,
      event,
    }
  }
}
