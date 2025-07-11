import { PartialType } from '@nestjs/mapped-types';
import { CreateExistenciaDto } from './create-existencia.dto';

export class UpdateExistenciaDto extends PartialType(CreateExistenciaDto) {}
