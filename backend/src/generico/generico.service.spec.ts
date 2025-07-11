import { Test, TestingModule } from '@nestjs/testing';
import { GenericoService } from './generico.service';

describe('GenericoService', () => {
  let service: GenericoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GenericoService],
    }).compile();

    service = module.get<GenericoService>(GenericoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
