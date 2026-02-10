export class CheckoutOrderCommand {
  constructor(
    public readonly userId: string,
    public readonly items: { productId: string; quantity: number }[],
  ) {}
}
