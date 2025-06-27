import { Customer } from '../../enterprise/entities/customer'

export interface CustomerRepository {
  findAll(): Promise<Customer[]>
  findById(id: string): Promise<Customer | null>
  findByEmail(email: string): Promise<Customer | null>
  create(customer: Customer): Promise<void>
  update(customer: Customer): Promise<void>
  delete(id: string): Promise<void>
}
