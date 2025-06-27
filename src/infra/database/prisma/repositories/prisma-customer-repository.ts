import { CustomerRepository } from '@/domain/customer/application/repositories/customer-repository'
import { Customer } from '@/domain/customer/enterprise/entities'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PrismaCustomerMapper } from '../mappers/prisma-customer-mapper'

@Injectable()
export class PrismaCustomerRepository implements CustomerRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<Customer | null> {
    const customer = await this.prisma.customer.findUnique({
      where: {
        id,
      },
    })

    if (!customer) {
      return null
    }

    return PrismaCustomerMapper.toDomain(customer)
  }

  async findByEmail(email: string): Promise<Customer | null> {
    const customer = await this.prisma.customer.findUnique({
      where: {
        email,
      },
    })

    if (!customer) {
      return null
    }

    return PrismaCustomerMapper.toDomain(customer)
  }
  async create(customer: Customer): Promise<void> {
    const data = PrismaCustomerMapper.toPrisma(customer)

    await this.prisma.customer.create({
      data,
    })
  }

  async update(customer: Customer): Promise<void> {
    const data = PrismaCustomerMapper.toPrisma(customer)

    await this.prisma.customer.update({
      where: { id: data.id },
      data,
    })
  }

  async delete(id: string): Promise<void> {
    const customer = await this.findById(id)

    if (!customer) {
      throw new Error('Customer not found')
    }

    await this.prisma.customer.delete({
      where: { id },
    })
  }

  async findAll(): Promise<Customer[]> {
    const customers = await this.prisma.customer.findMany()

    return customers.map(PrismaCustomerMapper.toDomain)
  }
}
