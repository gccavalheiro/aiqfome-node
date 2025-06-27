import { AggregateRoot } from '@/core/entities/aggregate-root'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

export interface CustomerProps {
  name: string
  email: string
  password: string
  createdAt: Date
  updatedAt?: Date | null
}

export class Customer extends AggregateRoot<CustomerProps> {
  get name(): string {
    return this.props.name
  }

  set name(name: string) {
    this.props.name = name
    this.touch()
  }

  get email(): string {
    return this.props.email
  }

  set email(email: string) {
    this.props.email = email
    this.touch()
  }

  get createdAt(): Date {
    return this.props.createdAt
  }

  get updatedAt(): Date | null {
    return this.props.updatedAt ?? null
  }

  get password(): string {
    return this.props.password
  }

  setPassword(password: string) {
    this.props.password = password
    this.touch()
  }

  private touch(): void {
    this.props.updatedAt = new Date()
  }

  static create(
    props: Optional<CustomerProps, 'createdAt'>,
    id?: UniqueEntityID,
  ): Customer {
    return new Customer(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )
  }
}
