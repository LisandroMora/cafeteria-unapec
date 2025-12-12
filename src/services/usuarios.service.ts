import { Usuario } from '@/types';
import { BaseService } from './base.service';
import { LocalStorageService } from '@/lib/storage';

class UsuariosServiceClass extends BaseService<Usuario> {
  constructor() {
    super('usuarios');
  }
  
  create(data: Omit<Usuario, 'id' | 'fechaRegistro'>): Usuario {
    const newItem = {
      ...data,
      fechaRegistro: new Date(),
      id: Date.now().toString()
    };
    const items = this.getAll();
    items.push(newItem);
    LocalStorageService.setItem('usuarios', items);
    return newItem;
  }
  
  getByTipoUsuario(tipoUsuarioId: string): Usuario[] {
    return this.search(usuario => usuario.tipoUsuarioId === tipoUsuarioId);
  }
}

export const UsuariosService = new UsuariosServiceClass();