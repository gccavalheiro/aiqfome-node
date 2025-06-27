import {
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger'
import axios from 'axios'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { CustomerFavoritesResponseDto } from '@/infra/http/dtos'

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
@Controller('/customers')
@UseGuards(JwtAuthGuard)
export class ListCustomerFavoriteController {
  constructor(private prisma: PrismaService) {}

  @Get('/:id/favorites')
  @ApiOperation({ summary: 'Listar favoritos do cliente' })
  @ApiParam({
    name: 'id',
    description: 'ID do cliente',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de favoritos retornada com sucesso',
    type: CustomerFavoritesResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Não autorizado',
  })
  @ApiResponse({
    status: 404,
    description: 'Cliente não encontrado',
  })
  async handle(@Param('id', ParseUUIDPipe) customerId: string) {
    const customer = await this.prisma.customer.findUnique({
      where: {
        id: customerId,
        deletedAt: null,
      },
    })

    if (!customer) {
      throw new NotFoundException('Customer not found')
    }

    const favorites = await this.prisma.favorite.findMany({
      where: {
        customerId,
        deletedAt: null,
      },
    })

    if (favorites.length === 0) {
      return {
        favorites: [],
      }
    }

    const { data: products } = await axios.get<Product[]>(
      'https://fakestoreapi.com/products',
    )

    const favoriteProducts = products
      .filter((product) =>
        favorites.some(
          (favorite) => favorite.productId === product.id.toString(),
        ),
      )
      .map((product) => ({
        id: product.id,
        title: product.title,
        image: product.image,
        price: product.price,
        review: product.rating,
      }))

    return {
      favorites: favoriteProducts,
    }
  }
}
