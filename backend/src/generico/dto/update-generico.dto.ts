import { PartialType } from '@nestjs/mapped-types';
import { CreateGenericoDto } from './create-generico.dto';

export class UpdateGenericoDto extends PartialType(CreateGenericoDto) {}
