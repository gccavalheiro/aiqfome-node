import {
  Controller,
  Delete,
  HttpCode,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { PrismaService } from '@/infra/prisma/prisma.service'

@Controller('/customers')
@UseGuards(JwtAuthGuard)
export class DeleteCustomerController {
  constructor(private prisma: PrismaService) {}

  @Delete('/:id')
  @HttpCode(204)
  async handle(@Param('id', ParseUUIDPipe) id: string) {
    const existingCustomer = await this.prisma.customer.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    })

    if (!existingCustomer) {
      throw new NotFoundException('Customer not found')
    }

    await this.prisma.customer.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    })
  }
}
