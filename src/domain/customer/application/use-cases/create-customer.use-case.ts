import { Customer } from '../../enterprise/entities/customer'
import { CustomerRepository } from '../repositories/customer-repository'
import { CustomerCreatedEvent } from '../../enterprise/events/customer-created.event'

export interface CreateCustomerRequest {
  name: string
  email: string
  password: string
}

export interface CreateCustomerResponse {
  customer: Customer
  event: CustomerCreatedEvent
}

export class CreateCustomerUseCase {
  constructor(private customerRepository: CustomerRepository) {}

  async execute(
    request: CreateCustomerRequest,
  ): Promise<CreateCustomerResponse> {
    const existingCustomer = await this.customerRepository.findByEmail(
      request.email,
    )

    if (existingCustomer) {
      throw new Error('Customer with this email already exists')
    }

    const customer = Customer.create({
      name: request.name,
      email: request.email,
      password: request.password,
    })

    await this.customerRepository.create(customer)

    const event = new CustomerCreatedEvent(
      customer.id.toString(),
      customer.name,
      customer.email,
      customer.createdAt,
    )

    return {
      customer,
      event,
    }
  }
}
