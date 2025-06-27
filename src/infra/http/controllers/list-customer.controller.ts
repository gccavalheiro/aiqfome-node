import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { PrismaService } from '@/infra/prisma/prisma.service'

@Controller('/customers')
@UseGuards(JwtAuthGuard)
export class ListCustomerController {
  constructor(private prisma: PrismaService) {}

  @Get('/')
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
