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
            findOne: jest.fn().mockResolvedValue({ id: '123', name: 'User' }),
            update: jest.fn().mockResolvedValue({ id: '123', name: 'Updated' }),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should get user profile', async () => {
    const req = { user: { userId: '123' } };
    expect(await controller.getMe(req)).toEqual({ id: '123', name: 'User' });
    expect(service.findOne).toHaveBeenCalledWith('123');
  });

  it('should update user profile', async () => {
    const req = { user: { userId: '123' } };
    const dto = { name: 'Updated' };
    expect(await controller.updateMe(req, dto)).toEqual({ id: '123', name: 'Updated' });
    expect(service.update).toHaveBeenCalledWith('123', dto);
  });
});
