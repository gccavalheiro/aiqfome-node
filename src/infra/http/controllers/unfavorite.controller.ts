import {
  Body,
  Controller,
  HttpCode,
  NotFoundException,
  Delete,
  UseGuards,
  UsePipes,
} from '@nestjs/common'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { PrismaService } from '@/infra/prisma/prisma.service'
import { z } from 'zod'

const unfavoriteBodySchema = z.object({
  customerId: z.string().uuid(),
  productId: z.string(),
})

type UnfavoriteBodySchema = z.infer<typeof unfavoriteBodySchema>

@Controller('/favorites')
@UseGuards(JwtAuthGuard)
export class UnfavoriteController {
  constructor(private prisma: PrismaService) {}

  @Delete('/')
  @HttpCode(204)
  @UsePipes(new ZodValidationPipe(unfavoriteBodySchema))
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
