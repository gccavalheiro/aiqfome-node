import { Favorite } from '../../enterprise/entities/favorite'
import { FavoriteRepository } from '../repositories/favorite-repository'

export interface FindAllFavoritesByCustomerIdRequest {
  customerId: string
}

export interface FindAllFavoritesByCustomerIdResponse {
  favorites: Favorite[]
}

export class FindAllFavoritesByCustomerIdUseCase {
  constructor(private favoriteRepository: FavoriteRepository) {}

  async execute(
    request: FindAllFavoritesByCustomerIdRequest,
  ): Promise<FindAllFavoritesByCustomerIdResponse> {
    const favorites = await this.favoriteRepository.findAllByCustomerId(
      request.customerId,
    )

    return {
      favorites,
    }
  }
}
