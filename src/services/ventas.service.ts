import { Venta, VentaItem } from '@/types';
import { BaseService } from './base.service';
import { ArticulosService } from './articulos.service';
import { LocalStorageService } from '@/lib/storage';

class VentasServiceClass extends BaseService<Venta> {
  constructor() {
    super('ventas');
  }
  
  create(data: Omit<Venta, 'id' | 'fecha' | 'numeroFactura'>): Venta {
    const ventas = this.getAll();
    const numeroFactura = `F-${String(ventas.length + 1).padStart(3, '0')}-${new Date().getFullYear()}`;
    
    const newVenta: Venta = {
      ...data,
      id: Date.now().toString(),
      numeroFactura,
      fecha: new Date(),
    };
    
    // Actualizar stock de artículos
    if (data.estado === 'completada') {
      data.items.forEach(item => {
        ArticulosService.updateStock(item.articuloId, item.cantidad);
      });
    }
    
    ventas.push(newVenta);
    LocalStorageService.setItem('ventas', ventas);
    return newVenta;
  }
  
  anular(id: string): boolean {
    const venta = this.getById(id);
    if (!venta || venta.estado === 'anulada') return false;
    
    // Restaurar stock
    venta.items.forEach(item => {
      const articulo = ArticulosService.getById(item.articuloId);
      if (articulo) {
        ArticulosService.update(item.articuloId, {
          existencia: articulo.existencia + item.cantidad
        });
      }
    });
    
    return this.update(id, { estado: 'anulada' }) !== null;
  }
  
  getByDateRange(desde: Date, hasta: Date): Venta[] {
    return this.search(venta => 
      venta.fecha >= desde && venta.fecha <= hasta
    );
  }
  
  getByUsuario(usuarioId: string): Venta[] {
    return this.search(venta => venta.usuarioId === usuarioId);
  }
  
  getByEmpleado(empleadoId: string): Venta[] {
    return this.search(venta => venta.empleadoId === empleadoId);
  }
}

export const VentasService = new VentasServiceClass();