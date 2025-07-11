export class CreateGenericoDto {
    item_generico: string;
    descripcion?: string;
    reabastecimiento: 'si' | 'no';
    estado: string;
  }
  