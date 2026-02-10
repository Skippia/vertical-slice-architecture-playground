import { Test, TestingModule } from '@nestjs/testing';
import { EventBus, QueryBus } from '@nestjs/cqrs';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CheckoutOrderHandler } from '../commands/checkout-order.handler';
import { CheckoutOrderCommand } from '../commands/checkout-order.command';
import { GetOrderHandler } from '../queries/get-order.handler';
import { GetOrderQuery } from '../queries/get-order.query';
import { GetUserOrdersHandler } from '../queries/get-user-orders.handler';
import { GetUserOrdersQuery } from '../queries/get-user-orders.query';
import { OrdersRepository } from '../infrastructure/orders.repository';

describe('Orders Handlers', () => {
  let checkoutHandler: CheckoutOrderHandler;
  let getOrderHandler: GetOrderHandler;
  let getUserOrdersHandler: GetUserOrdersHandler;

  const mockOrder = {
    id: 'order-uuid',
    userId: 'user-uuid',
    status: 'confirmed',
    totalAmount: 59.98,
    createdAt: '2024-01-01T00:00:00.000Z',
    items: [
      { id: 'item-uuid', productId: 'product-uuid', quantity: 2, unitPrice: 29.99 },
    ],
  };

  const mockProduct = {
    id: 'product-uuid',
    name: 'Test Product',
    price: 29.99,
    stock: 100,
  };

  const mockUser = {
    id: 'user-uuid',
    email: 'test@example.com',
    name: 'Test User',
  };

  const mockRepository = {
    create: jest.fn().mockResolvedValue(mockOrder),
    findById: jest.fn().mockResolvedValue(mockOrder),
    findByUserId: jest.fn().mockResolvedValue([mockOrder]),
  };

  const mockQueryBus = {
    execute: jest.fn(),
  };

  const mockEventBus = {
    publish: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CheckoutOrderHandler,
        GetOrderHandler,
        GetUserOrdersHandler,
        { provide: OrdersRepository, useValue: mockRepository },
        { provide: QueryBus, useValue: mockQueryBus },
        { provide: EventBus, useValue: mockEventBus },
      ],
    }).compile();

    checkoutHandler = module.get(CheckoutOrderHandler);
    getOrderHandler = module.get(GetOrderHandler);
    getUserOrdersHandler = module.get(GetUserOrdersHandler);

    jest.clearAllMocks();
  });

  describe('CheckoutOrderHandler', () => {
    it('should create an order and publish event', async () => {
      mockQueryBus.execute.mockImplementation((query) => {
        if (query.constructor.name === 'GetUserQuery') return mockUser;
        if (query.constructor.name === 'GetProductQuery') return mockProduct;
      });

      const command = new CheckoutOrderCommand('user-uuid', [
        { productId: 'product-uuid', quantity: 2 },
      ]);

      const result = await checkoutHandler.execute(command);

      expect(result.id).toBe('order-uuid');
      expect(mockRepository.create).toHaveBeenCalled();
      expect(mockEventBus.publish).toHaveBeenCalled();
    });

    it('should throw BadRequestException for insufficient stock', async () => {
      mockQueryBus.execute.mockImplementation((query) => {
        if (query.constructor.name === 'GetUserQuery') return mockUser;
        if (query.constructor.name === 'GetProductQuery')
          return { ...mockProduct, stock: 1 };
      });

      const command = new CheckoutOrderCommand('user-uuid', [
        { productId: 'product-uuid', quantity: 5 },
      ]);

      await expect(checkoutHandler.execute(command)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('GetOrderHandler', () => {
    it('should return an order by id', async () => {
      const query = new GetOrderQuery('order-uuid');
      const result = await getOrderHandler.execute(query);

      expect(result.id).toBe('order-uuid');
    });

    it('should throw NotFoundException when order not found', async () => {
      mockRepository.findById.mockResolvedValueOnce(null);
      const query = new GetOrderQuery('non-existent');

      await expect(getOrderHandler.execute(query)).rejects.toThrow(NotFoundException);
    });
  });

  describe('GetUserOrdersHandler', () => {
    it('should return orders for a user', async () => {
      const query = new GetUserOrdersQuery('user-uuid');
      const result = await getUserOrdersHandler.execute(query);

      expect(result).toHaveLength(1);
      expect(result[0].userId).toBe('user-uuid');
    });
  });
});
