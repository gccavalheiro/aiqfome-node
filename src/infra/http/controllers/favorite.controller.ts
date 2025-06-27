import {
  Body,
  ConflictException,
  Controller,
  HttpCode,
  NotFoundException,
  Post,
  UseGuards,
  UsePipes,
} from '@nestjs/common'
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import axios from 'axios'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { AddFavoriteDto, FavoriteResponseDto } from '@/infra/http/dtos'
import { z } from 'zod'

const favoriteBodySchema = z.object({
  customerId: z.string().uuid(),
  productId: z.string(),
})

type FavoriteBodySchema = z.infer<typeof favoriteBodySchema>

interface Product {
  id: number
  title: string
  price: number
  description: string
  category: string
  image: string
  rating: {
    rate: number
    count: number
  }
}

@ApiTags('favorites')
@ApiBearerAuth('JWT-auth')
@Controller('/favorites')
@UseGuards(JwtAuthGuard)
export class FavoriteController {
  constructor(private prisma: PrismaService) {}

  @Post('/')
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(favoriteBodySchema))
  @ApiOperation({ summary: 'Adicionar produto aos favoritos' })
  @ApiBody({ type: AddFavoriteDto })
  @ApiResponse({
    status: 201,
    description: 'Produto adicionado aos favoritos com sucesso',
    type: FavoriteResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Não autorizado',
  })
  @ApiResponse({
    status: 404,
    description: 'Cliente ou produto não encontrado',
  })
  @ApiResponse({
    status: 409,
    description: 'Produto já está nos favoritos',
  })
  async handle(@Body() body: FavoriteBodySchema) {
    const { customerId, productId } = body

    const customer = await this.prisma.customer.findUnique({
      where: { id: customerId },
    })

    if (!customer) {
      throw new NotFoundException('Customer not found')
    }

    const { data: products } = await axios.get<Product[]>(
      'https://fakestoreapi.com/products',
    )

    const product = products.find(
      (product: Product) => product.id.toString() === productId,
    )

    if (!product) {
      throw new NotFoundException('Product not found')
    }

    // Verificar se o favorito já existe
    const existingFavorite = await this.prisma.favorite.findUnique({
      where: {
        customerId_productId: {
          customerId,
          productId: product.id.toString(),
        },
      },
    })

    if (existingFavorite) {
      throw new ConflictException('Product already favorited')
    }

    const favorite = await this.prisma.favorite.create({
      data: {
        customerId,
        productId: product.id.toString(),
      },
    })

    return favorite
  }
}
