import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { PrismaService } from 'prisma/prisma.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService,PrismaService],
    }).compile();

    appController = module.get<AppController>(AppController);
  });

  describe('getUser', () => {
    it('should return "Hello World!"', async () => {
      const users = await appController.getUser();

      expect(Array.isArray(users)).toBe(true);
      if (users.length > 0) {
        expect(users[0]).toHaveProperty('id');
        expect(users[0]).toHaveProperty('name');
        expect(users[0]).toHaveProperty('email');
      }
    });
  });
});
