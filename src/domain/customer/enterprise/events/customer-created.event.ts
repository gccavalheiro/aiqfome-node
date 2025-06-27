export class CustomerCreatedEvent {
  constructor(
    public readonly customerId: string,
    public readonly name: string,
    public readonly email: string,
    public readonly occurredAt: Date,
  ) {}
} 