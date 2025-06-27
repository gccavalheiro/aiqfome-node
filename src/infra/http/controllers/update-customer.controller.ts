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
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { UpdateCustomerDto, CustomerResponseDto } from '@/infra/http/dtos'
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

@ApiTags('customers')
@ApiBearerAuth('JWT-auth')
@Controller('/customers')
@UseGuards(JwtAuthGuard)
export class UpdateCustomerController {
  constructor(private prisma: PrismaService) {}

  @Put('/:id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Atualizar cliente' })
  @ApiParam({
    name: 'id',
    description: 'ID do cliente',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiBody({ type: UpdateCustomerDto })
  @ApiResponse({
    status: 200,
    description: 'Cliente atualizado com sucesso',
    type: CustomerResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Não autorizado',
  })
  @ApiResponse({
    status: 404,
    description: 'Cliente não encontrado',
  })
  @ApiResponse({
    status: 409,
    description: 'Cliente com este email já existe',
  })
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
