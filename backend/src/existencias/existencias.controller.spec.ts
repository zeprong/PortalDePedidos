import { Test, TestingModule } from '@nestjs/testing';
import { ExistenciasController } from './existencias.controller';
import { ExistenciasService } from './existencias.service';

describe('ExistenciasController', () => {
  let controller: ExistenciasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExistenciasController],
      providers: [ExistenciasService],
    }).compile();

    controller = module.get<ExistenciasController>(ExistenciasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
