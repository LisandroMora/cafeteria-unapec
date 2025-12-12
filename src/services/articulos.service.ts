import { Articulo } from '@/types';
import { BaseService } from './base.service';

class ArticulosServiceClass extends BaseService<Articulo> {
  constructor() {
    super('articulos');
  }
  
  getByProveedor(proveedorId: string): Articulo[] {
    return this.search(articulo => articulo.proveedorId === proveedorId);
  }
  
  getByMarca(marcaId: string): Articulo[] {
    return this.search(articulo => articulo.marcaId === marcaId);
  }
  
  updateStock(id: string, cantidad: number): boolean {
    const articulo = this.getById(id);
    if (!articulo) return false;
    
    const nuevaExistencia = articulo.existencia - cantidad;
    if (nuevaExistencia < 0) return false;
    
    this.update(id, { existencia: nuevaExistencia });
    return true;
  }
}

export const ArticulosService = new ArticulosServiceClass();