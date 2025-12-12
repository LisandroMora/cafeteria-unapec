import { TipoUsuario } from '@/types';
import { BaseService } from './base.service';

class TiposUsuariosServiceClass extends BaseService<TipoUsuario> {
  constructor() {
    super('tiposUsuarios');
  }
}

export const TiposUsuariosService = new TiposUsuariosServiceClass();