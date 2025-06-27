import { Favorite } from '../../enterprise/entities/favorite'
import { FavoriteRepository } from '../repositories/favorite-repository'
import { FavoriteAddedEvent } from '../../enterprise/events/favorite-added.event'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface AddFavoriteRequest {
  customerId: string
  productId: string
}

export interface AddFavoriteResponse {
  favorite: Favorite
  event: FavoriteAddedEvent
}

export class AddFavoriteUseCase {
  constructor(private favoriteRepository: FavoriteRepository) {}

  async execute(request: AddFavoriteRequest): Promise<AddFavoriteResponse> {
    const existingFavorite =
      await this.favoriteRepository.findByCustomerAndProduct(
        request.customerId,
        request.productId,
      )

    if (existingFavorite) {
      throw new Error('Product is already in favorites')
    }

    const favorite = Favorite.create({
      customerId: new UniqueEntityID(request.customerId),
      productId: request.productId,
    })

    await this.favoriteRepository.create(favorite)

    const event = new FavoriteAddedEvent(
      favorite.id.toString(),
      favorite.customerId.toString(),
      favorite.productId,
      favorite.createdAt,
    )

    return {
      favorite,
      event,
    }
  }
}
