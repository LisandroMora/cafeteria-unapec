import { Empleado } from '@/types';
import { BaseService } from './base.service';
import { LocalStorageService } from '@/lib/storage';

class EmpleadosServiceClass extends BaseService<Empleado> {
  constructor() {
    super('empleados');
  }
  
  create(data: Omit<Empleado, 'id' | 'fechaIngreso'>): Empleado {
    const newItem = {
      ...data,
      fechaIngreso: new Date(),
      id: Date.now().toString()
    };
    const items = this.getAll();
    items.push(newItem);
    LocalStorageService.setItem('empleados', items);
    return newItem;
  }
  
  getByTanda(tanda: 'matutina' | 'vespertina' | 'nocturna'): Empleado[] {
    return this.search(empleado => empleado.tandaLabor === tanda);
  }
}

export const EmpleadosService = new EmpleadosServiceClass();