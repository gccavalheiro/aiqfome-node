export class CustomerUpdatedEvent {
  constructor(
    public readonly customerId: string,
    public readonly name: string,
    public readonly email: string,
    public readonly updatedAt: Date,
  ) {}
} 