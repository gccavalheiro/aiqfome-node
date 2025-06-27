import { AggregateRoot } from '@/core/entities/aggregate-root'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

export interface FavoriteProps {
  customerId: UniqueEntityID
  productId: string
  createdAt: Date
  updatedAt?: Date | null
}

export class Favorite extends AggregateRoot<FavoriteProps> {
  get customerId(): UniqueEntityID {
    return this.props.customerId
  }

  set customerId(customerId: UniqueEntityID) {
    this.props.customerId = customerId
    this.touch()
  }

  get productId(): string {
    return this.props.productId
  }

  set productId(productId: string) {
    this.props.productId = productId
    this.touch()
  }

  get createdAt(): Date {
    return this.props.createdAt
  }

  get updatedAt(): Date | null {
    return this.props.updatedAt ?? null
  }

  private touch(): void {
    this.props.updatedAt = new Date()
  }

  static create(
    props: Optional<FavoriteProps, 'createdAt'>,
    id?: UniqueEntityID,
  ): Favorite {
    const favorite = new Favorite(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    return favorite
  }
}
