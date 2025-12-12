import { Marca } from '@/types';
import { BaseService } from './base.service';

class MarcasServiceClass extends BaseService<Marca> {
  constructor() {
    super('marcas');
  }
}

export const MarcasService = new MarcasServiceClass();