import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service.js';
import { TasksService } from './tasks.service.js';

describe('TasksService', () => {
  let service: TasksService;

  // A fake Prisma client, so the tests don't need a real database.
  const prisma = {
    task: {
      create: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      count: vi.fn(),
    },
  };

  beforeEach(async () => {
    vi.resetAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [TasksService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = module.get(TasksService);
  });

  it('creates a task', async () => {
    prisma.task.create.mockResolvedValue({ id: '1', title: 'Belajar' });
    const result = await service.create({ title: 'Belajar' });
    expect(result.title).toBe('Belajar');
  });

  it('counts total and finished tasks', async () => {
    prisma.task.count.mockResolvedValueOnce(5).mockResolvedValueOnce(2);
    expect(await service.stats()).toEqual({ total: 5, done: 2, notDone: 3 });
  });

  it('throws 404 when the task does not exist', async () => {
    prisma.task.findUnique.mockResolvedValue(null);
    await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
  });

  it('does not delete a task that does not exist', async () => {
    prisma.task.findUnique.mockResolvedValue(null);
    await expect(service.remove('1')).rejects.toThrow(NotFoundException);
    expect(prisma.task.delete).not.toHaveBeenCalled();
  });
});
