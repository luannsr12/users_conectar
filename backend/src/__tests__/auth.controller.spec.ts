import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../modules/auth/auth.controller';
import { AuthService } from '../modules/auth/auth.service';
import { ConfigService } from '@nestjs/config';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            register: jest.fn().mockResolvedValue({ success: true }),
            login: jest.fn().mockResolvedValue({ access_token: 'fake-token' }),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'JWT_SECRET') return 'test-secret';
              if (key === 'JWT_EXPIRES_IN') return '3600s';
              return null;
            }),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should register a user', async () => {
    const dto = { name: 'Test', email: 'test@test.com', password: '123456' };
    expect(await controller.register(dto)).toEqual({ success: true });
    expect(service.register).toHaveBeenCalledWith(dto);
  });

  it('should login a user', async () => {
    const dto = { email: 'test@test.com', password: '123456' };
    expect(await controller.login(dto)).toEqual({ access_token: 'fake-token' });
    expect(service.login).toHaveBeenCalledWith(dto);
  });
});
