export class ProductOutDto {
  id: string
  name: string
  description: string
  price: number
  stock: number
  createdAt: Date
  updatedAt: Date

  static from(product: {
    id: string
    name: string
    description: string
    price: number
    stock: number
    createdAt: Date
    updatedAt: Date
  }): ProductOutDto {
    const dto = new ProductOutDto()
    dto.id = product.id
    dto.name = product.name
    dto.description = product.description
    dto.price = product.price
    dto.stock = product.stock
    dto.createdAt = product.createdAt
    dto.updatedAt = product.updatedAt
    return dto
  }
}
