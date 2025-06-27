import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Favorite } from '@/domain/favorite/enterprise/entities'
import { Prisma, Favorite as PrismaFavorite } from '@prisma/client'

export class PrismaFavoriteMapper {
  static toDomain(prismaFavorite: PrismaFavorite): Favorite {
    return Favorite.create(
      {
        customerId: new UniqueEntityID(prismaFavorite.customerId),
        productId: prismaFavorite.productId,
        createdAt: prismaFavorite.createdAt,
        updatedAt: prismaFavorite.updatedAt,
      },
      new UniqueEntityID(prismaFavorite.id),
    )
  }

  static toPrisma(favorite: Favorite): Prisma.FavoriteUncheckedCreateInput {
    return {
      id: favorite.id.toString(),
      customerId: favorite.customerId.toString(),
      productId: favorite.productId,
      createdAt: favorite.createdAt,
      updatedAt: favorite.updatedAt,
    }
  }
}
