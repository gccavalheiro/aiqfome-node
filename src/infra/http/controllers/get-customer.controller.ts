import {
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common'
import { PrismaService } from '@/infra/prisma/prisma.service'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'

@Controller('/customers')
@UseGuards(JwtAuthGuard)
export class GetCustomerController {
  constructor(private prisma: PrismaService) {}

  @Get('/:id')
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
