import { Favorite } from '../../enterprise/entities/favorite'

export interface FavoriteRepository {
  findAllByCustomerId(customerId: string): Promise<Favorite[]>
  findById(id: string): Promise<Favorite | null>
  findByCustomerAndProduct(
    customerId: string,
    productId: string,
  ): Promise<Favorite | null>
  create(favorite: Favorite): Promise<void>
  delete(id: string): Promise<void>
  deleteByCustomerAndProduct(
    customerId: string,
    productId: string,
  ): Promise<void>
}
