import {
  Body,
  Controller,
  HttpCode,
  NotFoundException,
  Delete,
  UseGuards,
  UsePipes,
} from '@nestjs/common'
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { AddFavoriteDto } from '@/infra/http/dtos'
import { z } from 'zod'

const unfavoriteBodySchema = z.object({
  customerId: z.string().uuid(),
  productId: z.string(),
})

type UnfavoriteBodySchema = z.infer<typeof unfavoriteBodySchema>

@ApiTags('favorites')
@ApiBearerAuth('JWT-auth')
@Controller('/favorites')
@UseGuards(JwtAuthGuard)
export class UnfavoriteController {
  constructor(private prisma: PrismaService) {}

  @Delete('/')
  @HttpCode(204)
  @UsePipes(new ZodValidationPipe(unfavoriteBodySchema))
  @ApiOperation({ summary: 'Remover produto dos favoritos' })
  @ApiBody({ type: AddFavoriteDto })
  @ApiResponse({
    status: 204,
    description: 'Produto removido dos favoritos com sucesso',
  })
  @ApiResponse({
    status: 401,
    description: 'Não autorizado',
  })
  @ApiResponse({
    status: 404,
    description: 'Cliente ou favorito não encontrado',
  })
  async handle(@Body() body: UnfavoriteBodySchema) {
    const { customerId, productId } = body

    const customer = await this.prisma.customer.findUnique({
      where: { id: customerId },
    })

    if (!customer) {
      throw new NotFoundException('Customer not found')
    }

    const favorite = await this.prisma.favorite.findUnique({
      where: {
        customerId_productId: {
          customerId,
          productId,
        },
      },
    })

    if (!favorite) {
      throw new NotFoundException('Favorite not found')
    }

    await this.prisma.favorite.delete({
      where: {
        customerId_productId: {
          customerId,
          productId,
        },
      },
    })
  }
}
