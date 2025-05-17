import { AutoMap } from '@automapper/classes';

export class OrderItem {
  @AutoMap()
  productId: string;

  @AutoMap()
  quantity: number;
}

export class Order {
  @AutoMap()
  orderId: string;

  @AutoMap()
  customerId: string;

  @AutoMap(() => OrderItem)
  items: OrderItem[];

  @AutoMap()
  processedAt: Date;
}
