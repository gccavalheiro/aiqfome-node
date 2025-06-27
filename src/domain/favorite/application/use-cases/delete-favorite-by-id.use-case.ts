import { Favorite } from '../../enterprise/entities/favorite'
import { FavoriteRepository } from '../repositories/favorite-repository'
import { FavoriteRemovedEvent } from '../../enterprise/events/favorite-removed.event'

export interface DeleteFavoriteByIdRequest {
  id: string
}

export interface DeleteFavoriteByIdResponse {
  favorite: Favorite
  event: FavoriteRemovedEvent
}

export class DeleteFavoriteByIdUseCase {
  constructor(private favoriteRepository: FavoriteRepository) {}

  async execute(
    request: DeleteFavoriteByIdRequest,
  ): Promise<DeleteFavoriteByIdResponse> {
    const favorite = await this.favoriteRepository.findById(request.id)

    if (!favorite) {
      throw new Error('Favorite not found')
    }

    await this.favoriteRepository.delete(request.id)

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