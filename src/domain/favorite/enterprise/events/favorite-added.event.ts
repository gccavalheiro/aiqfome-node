export class FavoriteAddedEvent {
  constructor(
    public readonly favoriteId: string,
    public readonly customerId: string,
    public readonly productId: string,
    public readonly occurredAt: Date,
  ) {}
} 