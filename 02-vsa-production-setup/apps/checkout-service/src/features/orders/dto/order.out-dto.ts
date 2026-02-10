export class OrderItemOutDto {
  id: string
  productId: string
  quantity: number
  unitPrice: number
}

export class OrderOutDto {
  id: string
  userId: string
  status: string
  totalAmount: number
  createdAt: Date
  items: OrderItemOutDto[]
}
