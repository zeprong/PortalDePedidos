import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Generico } from './entities/generico.entity';
import { CreateGenericoDto } from './dto/create-generico.dto';
import { UpdateGenericoDto } from './dto/update-generico.dto';

@Injectable()
export class GenericoService {
  constructor(
    @InjectRepository(Generico)
    private readonly genericoRepo: Repository<Generico>,
  ) {}

  create(dto: CreateGenericoDto): Promise<Generico> {
    const generico = this.genericoRepo.create(dto);
    return this.genericoRepo.save(generico);
  }

  findAll(): Promise<Generico[]> {
    return this.genericoRepo.find();
  }

  findOne(id: number): Promise<Generico | null> {
    return this.genericoRepo.findOne({ where: { id_generico: id } });
  }

  async update(id: number, dto: UpdateGenericoDto): Promise<Generico> {
    await this.genericoRepo.update(id, dto);
    const generico = await this.findOne(id);
    if (!generico) {
      throw new Error('El generico especificado no se encuentra');
    }
    return generico;
  }

  async remove(id: number): Promise<void> {
    await this.genericoRepo.delete(id);
  }

  async removeAll(): Promise<void> {
    await this.genericoRepo.clear();
  }
}
