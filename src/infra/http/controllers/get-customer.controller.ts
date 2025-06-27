import {
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { CustomerResponseDto } from '@/infra/http/dtos'

@ApiTags('customers')
@ApiBearerAuth('JWT-auth')
@Controller('/customers')
@UseGuards(JwtAuthGuard)
export class GetCustomerController {
  constructor(private prisma: PrismaService) {}

  @Get('/:id')
  @ApiOperation({ summary: 'Buscar cliente por ID' })
  @ApiParam({
    name: 'id',
    description: 'ID do cliente',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Cliente encontrado com sucesso',
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
  async handle(@Param('id', ParseUUIDPipe) id: string) {
    const customer = await this.prisma.customer.findUnique({
      where: {
        id,
        deletedAt: null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        favorites: {
          select: {
            productId: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
    })

    if (!customer) {
      throw new NotFoundException('Customer not found')
    }

    return customer
  }
}
