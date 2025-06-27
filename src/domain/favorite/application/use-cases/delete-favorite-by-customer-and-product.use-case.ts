import { Favorite } from '../../enterprise/entities/favorite'
import { FavoriteRepository } from '../repositories/favorite-repository'
import { FavoriteRemovedEvent } from '../../enterprise/events/favorite-removed.event'

export interface DeleteFavoriteByCustomerAndProductRequest {
  customerId: string
  productId: string
}

export interface DeleteFavoriteByCustomerAndProductResponse {
  favorite: Favorite
  event: FavoriteRemovedEvent
}

export class DeleteFavoriteByCustomerAndProductUseCase {
  constructor(private favoriteRepository: FavoriteRepository) {}

  async execute(
    request: DeleteFavoriteByCustomerAndProductRequest,
  ): Promise<DeleteFavoriteByCustomerAndProductResponse> {
    const favorite = await this.favoriteRepository.findByCustomerAndProduct(
      request.customerId,
      request.productId,
    )

    if (!favorite) {
      throw new Error('Product is not in favorites')
    }

    await this.favoriteRepository.deleteByCustomerAndProduct(
      request.customerId,
      request.productId,
    )

    const event = new FavoriteRemovedEvent(
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
