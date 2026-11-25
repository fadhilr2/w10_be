import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller.js';
import { TasksService } from './tasks.service.js';

describe('TasksController', () => {
  let controller: TasksController;

  // A fake service, so we only test the controller here.
  const service = { findAll: vi.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [{ provide: TasksService, useValue: service }],
    }).compile();

    controller = module.get(TasksController);
  });

  it('returns all tasks from the service', async () => {
    service.findAll.mockResolvedValue([{ id: '1', title: 'Belajar' }]);
    expect(await controller.findAll()).toHaveLength(1);
  });
});
