import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserHandler } from '../commands/create-user.handler';
import { CreateUserCommand } from '../commands/create-user.command';
import { GetUserHandler } from '../queries/get-user.handler';
import { GetUserQuery } from '../queries/get-user.query';
import { GetAllUsersHandler } from '../queries/get-all-users.handler';
import { GetAllUsersQuery } from '../queries/get-all-users.query';
import { UsersRepository } from '../infrastructure/users.repository';
import { NotFoundException } from '@nestjs/common';

describe('Users Handlers', () => {
  let createHandler: CreateUserHandler;
  let getHandler: GetUserHandler;
  let getAllHandler: GetAllUsersHandler;

  const mockUser = {
    id: 'user-uuid',
    email: 'test@example.com',
    name: 'Test User',
    createdAt: '2024-01-01T00:00:00.000Z',
  };

  const mockRepository = {
    create: jest.fn().mockResolvedValue(mockUser),
    findById: jest.fn().mockResolvedValue(mockUser),
    findAll: jest.fn().mockResolvedValue([mockUser]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateUserHandler,
        GetUserHandler,
        GetAllUsersHandler,
        { provide: UsersRepository, useValue: mockRepository },
      ],
    }).compile();

    createHandler = module.get(CreateUserHandler);
    getHandler = module.get(GetUserHandler);
    getAllHandler = module.get(GetAllUsersHandler);

    jest.clearAllMocks();
  });

  describe('CreateUserHandler', () => {
    it('should create a user and return DTO', async () => {
      const command = new CreateUserCommand('test@example.com', 'Test User');
      const result = await createHandler.execute(command);

      expect(mockRepository.create).toHaveBeenCalledWith({
        email: 'test@example.com',
        name: 'Test User',
      });
      expect(result.id).toBe('user-uuid');
      expect(result.email).toBe('test@example.com');
    });
  });

  describe('GetUserHandler', () => {
    it('should return a user by id', async () => {
      const query = new GetUserQuery('user-uuid');
      const result = await getHandler.execute(query);

      expect(mockRepository.findById).toHaveBeenCalledWith('user-uuid');
      expect(result.id).toBe('user-uuid');
    });

    it('should throw NotFoundException when user not found', async () => {
      mockRepository.findById.mockResolvedValueOnce(null);
      const query = new GetUserQuery('non-existent');

      await expect(getHandler.execute(query)).rejects.toThrow(NotFoundException);
    });
  });

  describe('GetAllUsersHandler', () => {
    it('should return all users', async () => {
      const result = await getAllHandler.execute(new GetAllUsersQuery());

      expect(mockRepository.findAll).toHaveBeenCalled();
      expect(result).toHaveLength(1);
      expect(result[0].email).toBe('test@example.com');
    });
  });
});
