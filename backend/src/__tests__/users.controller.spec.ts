import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../modules/users/users.controller';
import { UsersService } from '../modules/users/users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            findOne: jest.fn().mockImplementation((id: string) =>
              Promise.resolve({ id, name: id === '123' ? 'User' : 'Unknown' }),
            ),
            update: jest.fn().mockImplementation((id: string, dto: any) =>
              Promise.resolve({ id, name: dto.name }),
            ),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should get user profile', async () => {
    const req = { user: { id: '123' } } as any;  // <-- mudou aqui
    const result = await controller.getMe(req);
    expect(result).toEqual({ id: '123', name: 'User' });
    expect(service.findOne).toHaveBeenCalledWith('123');
  });

  it('should update user profile', async () => {
    const req = { user: { id: '123' } } as any;  // <-- mudou aqui
    const dto = { name: 'Updated' };
    const result = await controller.updateMe(req, dto);
    expect(result).toEqual({ id: '123', name: 'Updated' });
    expect(service.update).toHaveBeenCalledWith('123', dto);
  });
});
