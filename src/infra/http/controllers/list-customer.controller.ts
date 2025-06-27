import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { CustomerListResponseDto } from '@/infra/http/dtos'

@ApiTags('customers')
@ApiBearerAuth('JWT-auth')
@Controller('/customers')
@UseGuards(JwtAuthGuard)
export class ListCustomerController {
  constructor(private prisma: PrismaService) {}

  @Get('/')
  @ApiOperation({ summary: 'Listar todos os clientes' })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Número da página',
    example: 1,
  })
  @ApiQuery({
    name: 'perPage',
    required: false,
    description: 'Itens por página',
    example: 10,
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de clientes retornada com sucesso',
    type: CustomerListResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Não autorizado',
  })
  async handle(
    @Query('page') page?: string,
    @Query('perPage') perPage?: string,
  ) {
    const pageNumber = page ? parseInt(page, 10) : 1
    const itemsPerPage = perPage ? parseInt(perPage, 10) : 10
    const skip = (pageNumber - 1) * itemsPerPage

    const [customers, total] = await Promise.all([
      this.prisma.customer.findMany({
        where: {
          deletedAt: null,
        },
        skip,
        take: itemsPerPage,
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.customer.count({
        where: {
          deletedAt: null,
        },
      }),
    ])

    return {
      customers,
      pagination: {
        page: pageNumber,
        perPage: itemsPerPage,
        total,
        totalPages: Math.ceil(total / itemsPerPage),
      },
    }
  }
}
