import { Favorite } from '../../enterprise/entities/favorite'
import { FavoriteRepository } from '../repositories/favorite-repository'

export interface FindFavoriteByIdRequest {
  id: string
}

export interface FindFavoriteByIdResponse {
  favorite: Favorite | null
}

export class FindFavoriteByIdUseCase {
  constructor(private favoriteRepository: FavoriteRepository) {}

  async execute(
    request: FindFavoriteByIdRequest,
  ): Promise<FindFavoriteByIdResponse> {
    const favorite = await this.favoriteRepository.findById(request.id)

    return {
      favorite,
    }
  }
} 