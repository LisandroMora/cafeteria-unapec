import { Proveedor } from '@/types';
import { BaseService } from './base.service';
import { LocalStorageService } from '@/lib/storage';

class ProveedoresServiceClass extends BaseService<Proveedor> {
  constructor() {
    super('proveedores');
  }
  
  // Sobrescribir create para manejar fechaRegistro
  create(data: Omit<Proveedor, 'id' | 'fechaRegistro'>): Proveedor {
    const newItem = {
      ...data,
      fechaRegistro: new Date(),
      id: Date.now().toString()
    };
    const items = this.getAll();
    items.push(newItem);
    LocalStorageService.setItem('proveedores', items);
    return newItem;
  }
}

export const ProveedoresService = new ProveedoresServiceClass();