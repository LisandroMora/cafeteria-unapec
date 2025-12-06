// Tipos de Usuarios
export interface TipoUsuario {
  id: string;
  descripcion: string;
  estado: boolean;
}

// Marcas
export interface Marca {
  id: string;
  descripcion: string;
  estado: boolean;
}

// Campus
export interface Campus {
  id: string;
  descripcion: string;
  estado: boolean;
}

// Proveedores
export interface Proveedor {
  id: string;
  nombreComercial: string;
  rnc: string;
  fechaRegistro: Date;
  estado: boolean;
}

// Cafeterías
export interface Cafeteria {
  id: string;
  descripcion: string;
  campusId: string;
  campus?: Campus;
  encargado: string;
  estado: boolean;
}

// Usuarios
export interface Usuario {
  id: string;
  nombre: string;
  cedula: string;
  tipoUsuarioId: string;
  tipoUsuario?: TipoUsuario;
  limiteCredito: number;
  fechaRegistro: Date;
  estado: boolean;
}

// Empleados
export interface Empleado {
  id: string;
  nombre: string;
  cedula: string;
  tandaLabor: 'matutina' | 'vespertina' | 'nocturna';
  porcientoComision: number;
  fechaIngreso: Date;
  estado: boolean;
}

// Artículos
export interface Articulo {
  id: string;
  descripcion: string;
  marcaId: string;
  marca?: Marca;
  costo: number;
  precio: number;
  proveedorId: string;
  proveedor?: Proveedor;
  existencia: number;
  estado: boolean;
}

// Ventas
export interface Venta {
  id: string;
  numeroFactura: string;
  empleadoId: string;
  empleado?: Empleado;
  usuarioId: string;
  usuario?: Usuario;
  fecha: Date;
  items: VentaItem[];
  total: number;
  estado: 'completada' | 'anulada';
}

export interface VentaItem {
  articuloId: string;
  articulo?: Articulo;
  cantidad: number;
  precio: number;
  subtotal: number;
}