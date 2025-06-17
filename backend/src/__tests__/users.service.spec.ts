import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../modules/users/users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../common/entities/user.entity';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
  hash: jest.fn(),
}));

describe('UsersService', () => {
  let service: UsersService;
  let repo: any;

  beforeEach(async () => {
    repo = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useValue: repo },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should hash password and save user', async () => {
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashed');
    repo.create.mockReturnValue({ password: 'hashed' });
    repo.save.mockResolvedValue({ id: '123' });

    const result = await service.create({
      name: 'Test',
      email: 'test@test.com',
      password: 'plain',
    });

    expect(bcrypt.hash).toHaveBeenCalledWith('plain', 10);
    expect(repo.create).toHaveBeenCalled();
    expect(repo.save).toHaveBeenCalled();
    expect(result).toEqual({ id: '123' });
  });

  // resto igual...
});
