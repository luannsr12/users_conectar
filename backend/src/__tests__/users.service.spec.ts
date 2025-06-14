// src/__tests__/users/users.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users/users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { Repository } from 'typeorm';

describe('UsersService', () => {
  let service: UsersService;
  let repo: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository, // mocka Repository
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repo = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a user', async () => {
    jest.spyOn(repo, 'create').mockReturnValue({} as any);
    jest.spyOn(repo, 'save').mockResolvedValue({ id: '1', email: 'test@test.com' } as any);

    const result = await service.create({ email: 'test@test.com', password: 'pass' });
    expect(result).toHaveProperty('id');
  });
});
