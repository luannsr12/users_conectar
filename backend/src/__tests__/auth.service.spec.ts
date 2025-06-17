import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../modules/auth/auth.service';
import { UsersService } from '../modules/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
  hash: jest.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;
  let usersService: any;
  let jwtService: any;

  beforeEach(async () => {
    usersService = {
      findByEmail: jest.fn(),
      create: jest.fn(),
    };

    jwtService = {
      sign: jest.fn().mockReturnValue('signed-token'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersService },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should validate user with correct password', async () => {
    usersService.findByEmail.mockResolvedValue({ password: 'hashed' });
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);

    const result = await service.validateUser('email', 'pass');
    expect(result).toBeDefined();
  });

  it('should return null if password invalid', async () => {
    usersService.findByEmail.mockResolvedValue({ password: 'hashed' });
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    const result = await service.validateUser('email', 'wrong');
    expect(result).toBeNull();
  });

  // resto igual...
});
