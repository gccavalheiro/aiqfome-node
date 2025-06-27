import {
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
  UsePipes,
} from '@nestjs/common'
import { hash } from 'bcryptjs'
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { CreateCustomerDto, CustomerResponseDto } from '@/infra/http/dtos'
import { z } from 'zod'

const createCustomerBodySchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  email: z.string().email('Invalid email format'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters'),
})

type CreateCustomerBodySchema = z.infer<typeof createCustomerBodySchema>

@ApiTags('customers')
@Controller('/customers')
export class CreateCustomerController {
  constructor(private prisma: PrismaService) {}

  @Post('/')
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createCustomerBodySchema))
  @ApiOperation({ summary: 'Criar novo cliente' })
  @ApiBody({ type: CreateCustomerDto })
  @ApiResponse({
    status: 201,
    description: 'Cliente criado com sucesso',
    type: CustomerResponseDto,
  })
  @ApiResponse({
    status: 409,
    description: 'Cliente com este email já existe',
  })
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
      createdAt: customer.createdAt,
      updatedAt: customer.updatedAt,
    }
  }
}
