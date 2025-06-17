import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from '../app.controller';
import pkg from '../../package.json';

describe('AppController', () => {
  let appController: AppController;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
    }).compile();

    appController = module.get<AppController>(AppController);
  });

  it('should return "API is running"', () => {
    expect(appController.getRoot()).toEqual({ message: 'API is running' });
  });

  it('should return version info', () => {
    expect(appController.getVersion()).toEqual({ version: pkg.version });
  });
});
