import {
  Body,
  ConflictException,
  Controller,
  HttpCode,
  NotFoundException,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common'
import { hash } from 'bcryptjs'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { PrismaService } from '@/infra/prisma/prisma.service'
import { z } from 'zod'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'

const updateCustomerBodySchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters').optional(),
  email: z.string().email('Invalid email format').optional(),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .optional(),
})

type UpdateCustomerBodySchema = z.infer<typeof updateCustomerBodySchema>

@Controller('/customers')
@UseGuards(JwtAuthGuard)
export class UpdateCustomerController {
  constructor(private prisma: PrismaService) {}

  @Put('/:id')
  @HttpCode(200)
  async handle(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateCustomerBodySchema))
    body: UpdateCustomerBodySchema,
  ) {
    const { name, email, password } = body

    const existingCustomer = await this.prisma.customer.findUnique({
      where: {
        id,
        deletedAt: null,
      },
    })

    if (!existingCustomer) {
      throw new NotFoundException('Customer not found')
    }

    if (email && email !== existingCustomer.email) {
      const customerWithSameEmail = await this.prisma.customer.findFirst({
        where: {
          email,
          deletedAt: null,
        },
      })

      if (customerWithSameEmail) {
        throw new ConflictException('Customer with same email already exists')
      }
    }

    const updateData: UpdateCustomerBodySchema = {}

    if (name) {
      updateData.name = name
    }

    if (email) {
      updateData.email = email
    }

    if (password) {
      updateData.password = await hash(password, 8)
    }

    const customer = await this.prisma.customer.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return customer
  }
}
