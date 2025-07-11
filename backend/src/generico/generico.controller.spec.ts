import { Test, TestingModule } from '@nestjs/testing';
import { GenericoController } from './generico.controller';
import { GenericoService } from './generico.service';

describe('GenericoController', () => {
  let controller: GenericoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GenericoController],
      providers: [GenericoService],
    }).compile();

    controller = module.get<GenericoController>(GenericoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
