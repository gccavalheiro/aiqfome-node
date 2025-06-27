import { Injectable } from '@nestjs/common'
import { FavoriteRepository } from '@/domain/favorite/application/repositories/favorite-repository'
import { Favorite } from '@/domain/favorite/enterprise/entities'
import { PrismaFavoriteMapper } from '../mappers/prisma-favorite-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaFavoriteRepository implements FavoriteRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<Favorite | null> {
    const favorite = await this.prisma.favorite.findUnique({
      where: { id },
    })

    return favorite ? PrismaFavoriteMapper.toDomain(favorite) : null
  }

  async findAllByCustomerId(customerId: string): Promise<Favorite[]> {
    const favorites = await this.prisma.favorite.findMany({
      where: { customerId },
    })

    return favorites.map(PrismaFavoriteMapper.toDomain)
  }

  async findByCustomerAndProduct(
    customerId: string,
    productId: string,
  ): Promise<Favorite | null> {
    const favorite = await this.prisma.favorite.findFirst({
      where: { customerId, productId },
    })

    if (!favorite) {
      return null
    }

    return PrismaFavoriteMapper.toDomain(favorite)
  }

  async create(favorite: Favorite): Promise<void> {
    const data = PrismaFavoriteMapper.toPrisma(favorite)

    await this.prisma.favorite.create({
      data,
    })
  }

  async delete(id: string): Promise<void> {
    const favorite = await this.findById(id)

    if (!favorite) {
      throw new Error('Favorite not found')
    }

    await this.prisma.favorite.delete({
      where: { id },
    })
  }

  async deleteByCustomerAndProduct(
    customerId: string,
    productId: string,
  ): Promise<void> {
    const favorite = await this.findByCustomerAndProduct(customerId, productId)

    if (!favorite) {
      throw new Error('Favorite not found')
    }

    await this.prisma.favorite.delete({
      where: { customerId_productId: { customerId, productId } },
    })
  }
}
