import {
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
  UsePipes,
} from '@nestjs/common'
import { hash } from 'bcryptjs'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { PrismaService } from '@/infra/prisma/prisma.service'
import { z } from 'zod'

const createCustomerBodySchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  email: z.string().email('Invalid email format'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters'),
})

type CreateCustomerBodySchema = z.infer<typeof createCustomerBodySchema>

@Controller('/customers')
export class CreateCustomerController {
  constructor(private prisma: PrismaService) {}

  @Post('/')
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createCustomerBodySchema))
  async handle(@Body() body: CreateCustomerBodySchema) {
    const { name, email, password } = body

    const userWithSameEmail = await this.prisma.customer.findUnique({
      where: { email },
    })

    if (userWithSameEmail) {
      throw new ConflictException('Customer with same email already exists')
    }

    const hashedPassword = await hash(password, 8)

    const customer = await this.prisma.customer.create({
      data: { name, email, password: hashedPassword },
    })

    return {
      id: customer.id,
      name: customer.name,
      email: customer.email,
    }
  }
}
