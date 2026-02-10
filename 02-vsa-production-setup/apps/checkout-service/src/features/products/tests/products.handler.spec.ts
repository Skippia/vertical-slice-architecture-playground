import { Test, TestingModule } from '@nestjs/testing'
import { CreateProductHandler } from '../commands/create-product.handler'
import { CreateProductCommand } from '../commands/create-product.command'
import { GetProductHandler } from '../queries/get-product.handler'
import { GetProductQuery } from '../queries/get-product.query'
import { GetAllProductsHandler } from '../queries/get-all-products.handler'
import { GetAllProductsQuery } from '../queries/get-all-products.query'
import { ProductsRepository } from '../infrastructure/products.repository'
import { NotFoundException } from '@nestjs/common'

describe('Products Handlers', () => {
  let createHandler: CreateProductHandler
  let getHandler: GetProductHandler
  let getAllHandler: GetAllProductsHandler

  const mockProduct = {
    id: 'test-uuid',
    name: 'Test Product',
    description: 'A test product',
    price: 29.99,
    stock: 100,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  }

  const mockRepository = {
    create: jest.fn().mockResolvedValue(mockProduct),
    findById: jest.fn().mockResolvedValue(mockProduct),
    findAll: jest.fn().mockResolvedValue([mockProduct]),
    updateStock: jest.fn().mockResolvedValue(undefined),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateProductHandler,
        GetProductHandler,
        GetAllProductsHandler,
        { provide: ProductsRepository, useValue: mockRepository },
      ],
    }).compile()

    createHandler = module.get(CreateProductHandler)
    getHandler = module.get(GetProductHandler)
    getAllHandler = module.get(GetAllProductsHandler)

    jest.clearAllMocks()
  })

  describe('CreateProductHandler', () => {
    it('should create a product and return DTO', async () => {
      const command = new CreateProductCommand('Test Product', 'A test product', 29.99, 100)
      const result = await createHandler.execute(command)

      expect(mockRepository.create).toHaveBeenCalledWith({
        name: 'Test Product',
        description: 'A test product',
        price: 29.99,
        stock: 100,
      })
      expect(result.id).toBe('test-uuid')
      expect(result.name).toBe('Test Product')
    })
  })

  describe('GetProductHandler', () => {
    it('should return a product by id', async () => {
      const query = new GetProductQuery('test-uuid')
      const result = await getHandler.execute(query)

      expect(mockRepository.findById).toHaveBeenCalledWith('test-uuid')
      expect(result.id).toBe('test-uuid')
    })

    it('should throw NotFoundException when product not found', async () => {
      mockRepository.findById.mockResolvedValueOnce(null)
      const query = new GetProductQuery('non-existent')

      await expect(getHandler.execute(query)).rejects.toThrow(NotFoundException)
    })
  })

  describe('GetAllProductsHandler', () => {
    it('should return all products', async () => {
      const result = await getAllHandler.execute(new GetAllProductsQuery())

      expect(mockRepository.findAll).toHaveBeenCalled()
      expect(result).toHaveLength(1)
      expect(result[0].name).toBe('Test Product')
    })
  })
})
