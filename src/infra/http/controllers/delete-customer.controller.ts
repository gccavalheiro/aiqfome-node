import {
  Controller,
  Delete,
  HttpCode,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

@ApiTags('customers')
@ApiBearerAuth('JWT-auth')
@Controller('/customers')
@UseGuards(JwtAuthGuard)
export class DeleteCustomerController {
  constructor(private prisma: PrismaService) {}

  @Delete('/:id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Excluir cliente' })
  @ApiParam({
    name: 'id',
    description: 'ID do cliente',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 204,
    description: 'Cliente excluído com sucesso',
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
