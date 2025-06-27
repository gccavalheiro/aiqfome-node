import {
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common'
import axios from 'axios'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { PrismaService } from '@/infra/prisma/prisma.service'

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

@Controller('/customers')
@UseGuards(JwtAuthGuard)
export class ListCustomerFavoriteController {
  constructor(private prisma: PrismaService) {}

  @Get('/:id/favorites')
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

    return favoriteProducts
  }
}
