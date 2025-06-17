import { Test, TestingModule } from '@nestjs/testing';
import { AdminUsersController } from '../modules/admin/admin-users.controller';
import { UsersService } from '../modules/users/users.service';

describe('AdminUsersController', () => {
    let controller: AdminUsersController;
    let service: UsersService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AdminUsersController],
            providers: [
                {
                    provide: UsersService,
                    useValue: {
                        create: jest.fn().mockResolvedValue({ id: '123' }),
                        findAll: jest.fn().mockResolvedValue([{ id: '123' }]),
                        remove: jest.fn().mockResolvedValue({ message: 'User deleted successfully' }),
                    },
                },
            ],
        }).compile();

        controller = module.get<AdminUsersController>(AdminUsersController);
        service = module.get<UsersService>(UsersService);
    });

    it('should create a user if admin', async () => {
        const req = { user: { role: 'admin' } };
        const dto = { name: 'Test', email: 'test@test.com', password: '123456' };
        expect(await controller.create(req, dto)).toEqual({ id: '123' });
        expect(service.create).toHaveBeenCalledWith(dto);
    });

    it('should find all users if admin', async () => {
        const req = { user: { role: 'admin' } };
        expect(await controller.findAll(req)).toEqual([{ id: '123' }]);
        expect(service.findAll).toHaveBeenCalled();
    });

    it('should remove a user if admin', async () => {
        const req = { user: { role: 'admin' } };
        expect(await controller.remove(req, '123')).toEqual({ message: 'User deleted successfully' });
        expect(service.remove).toHaveBeenCalledWith('123');
    });
});
