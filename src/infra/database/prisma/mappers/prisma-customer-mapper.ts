import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Customer } from '@/domain/customer/enterprise/entities'
import { Prisma, Customer as PrismaCustomer } from '@prisma/client'

export class PrismaCustomerMapper {
  static toDomain(prismaCustomer: PrismaCustomer): Customer {
    return Customer.create(
      {
        name: prismaCustomer.name,
        email: prismaCustomer.email,
        password: prismaCustomer.password,
        createdAt: prismaCustomer.createdAt,
        updatedAt: prismaCustomer.updatedAt,
      },
      new UniqueEntityID(prismaCustomer.id),
    )
  }

  static toPrisma(customer: Customer): Prisma.CustomerUncheckedCreateInput {
    return {
      id: customer.id.toString(),
      name: customer.name,
      email: customer.email,
      password: customer.password,
      createdAt: customer.createdAt,
      updatedAt: customer.updatedAt,
    }
  }
}
