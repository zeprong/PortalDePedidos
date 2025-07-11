import { Test, TestingModule } from '@nestjs/testing';
import { ExistenciasService } from './existencias.service';

describe('ExistenciasService', () => {
  let service: ExistenciasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExistenciasService],
    }).compile();

    service = module.get<ExistenciasService>(ExistenciasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
