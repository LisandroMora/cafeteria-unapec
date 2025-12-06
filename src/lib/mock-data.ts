import { TipoUsuario, Marca, Campus, Proveedor, Cafeteria, Usuario, Empleado, Articulo, Venta } from '@/types';

// Tipos de Usuarios
export const tiposUsuarios: TipoUsuario[] = [
  { id: '1', descripcion: 'Estudiante', estado: true },
  { id: '2', descripcion: 'Profesor', estado: true },
  { id: '3', descripcion: 'Administrativo', estado: true },
  { id: '4', descripcion: 'Visitante', estado: false },
  { id: '5', descripcion: 'Personal de Servicio', estado: true },
];

// Marcas de productos
export const marcas: Marca[] = [
  { id: '1', descripcion: 'Coca-Cola', estado: true },
  { id: '2', descripcion: 'Pepsi', estado: true },
  { id: '3', descripcion: 'Rica', estado: true },
  { id: '4', descripcion: 'Induveca', estado: true },
  { id: '5', descripcion: 'Nestlé', estado: false },
];

// Campus
export const campus: Campus[] = [
  { id: '1', descripcion: 'Campus I', estado: true },
  { id: '2', descripcion: 'Campus II', estado: true },
  { id: '3', descripcion: 'Campus III', estado: false },
  { id: '4', descripcion: 'Extensión Santiago', estado: true },
];

// Proveedores
export const proveedores: Proveedor[] = [
  { 
    id: '1', 
    nombreComercial: 'Distribuidora Nacional',
    rnc: '123456789',
    fechaRegistro: new Date('2025-09-15'),
    estado: true 
  },
  { 
    id: '2', 
    nombreComercial: 'Alimentos del Caribe',
    rnc: '987654321',
    fechaRegistro: new Date('2025-09-20'),
    estado: true 
  },
  { 
    id: '3', 
    nombreComercial: 'Bebidas Premium',
    rnc: '456789123',
    fechaRegistro: new Date('2025-09-10'),
    estado: false 
  },
];

// Cafeterías
export const cafeterias: Cafeteria[] = [
  { 
    id: '1', 
    descripcion: 'Cafetería Principal', 
    campusId: '1',
    encargado: 'María Pérez',
    estado: true 
  },
  { 
    id: '2', 
    descripcion: 'Cafetería Express', 
    campusId: '1',
    encargado: 'Juan García',
    estado: true 
  },
  { 
    id: '3', 
    descripcion: 'Cafetería Edificio 3', 
    campusId: '2',
    encargado: 'Ana Martínez',
    estado: true 
  },
  { 
    id: '4', 
    descripcion: 'Cafetería Biblioteca', 
    campusId: '2',
    encargado: 'Carlos Rodríguez',
    estado: false 
  },
  { 
    id: '5', 
    descripcion: 'Cafetería Norte', 
    campusId: '4',
    encargado: 'Luis Fernández',
    estado: true 
  },
];

// Agregar estos datos al archivo existente:

// Usuarios
export const usuarios: Usuario[] = [
  {
    id: '1',
    nombre: 'Pedro Martínez',
    cedula: '00111222333',
    tipoUsuarioId: '1',
    limiteCredito: 5000,
    fechaRegistro: new Date('2023-01-15'),
    estado: true
  },
  {
    id: '2',
    nombre: 'Laura García',
    cedula: '00444555666',
    tipoUsuarioId: '2',
    limiteCredito: 10000,
    fechaRegistro: new Date('2023-02-20'),
    estado: true
  },
  {
    id: '3',
    nombre: 'José Rodríguez',
    cedula: '00777888999',
    tipoUsuarioId: '1',
    limiteCredito: 3000,
    fechaRegistro: new Date('2023-03-10'),
    estado: true
  },
];

// Empleados
export const empleados: Empleado[] = [
  {
    id: '1',
    nombre: 'Carmen López',
    cedula: '00123456789',
    tandaLabor: 'matutina',
    porcientoComision: 5,
    fechaIngreso: new Date('2022-01-10'),
    estado: true
  },
  {
    id: '2',
    nombre: 'Roberto Díaz',
    cedula: '00987654321',
    tandaLabor: 'vespertina',
    porcientoComision: 7,
    fechaIngreso: new Date('2022-06-15'),
    estado: true
  },
  {
    id: '3',
    nombre: 'Ana Sánchez',
    cedula: '00456789123',
    tandaLabor: 'nocturna',
    porcientoComision: 10,
    fechaIngreso: new Date('2023-01-05'),
    estado: true
  },
];

// Artículos
export const articulos: Articulo[] = [
  {
    id: '1',
    descripcion: 'Café Expreso',
    marcaId: '3',
    costo: 25,
    precio: 50,
    proveedorId: '1',
    existencia: 100,
    estado: true
  },
  {
    id: '2',
    descripcion: 'Sandwich de Jamón y Queso',
    marcaId: '4',
    costo: 75,
    precio: 125,
    proveedorId: '2',
    existencia: 50,
    estado: true
  },
  {
    id: '3',
    descripcion: 'Jugo de Naranja Natural',
    marcaId: '3',
    costo: 30,
    precio: 60,
    proveedorId: '1',
    existencia: 80,
    estado: true
  },
  {
    id: '4',
    descripcion: 'Empanada de Pollo',
    marcaId: '4',
    costo: 40,
    precio: 75,
    proveedorId: '2',
    existencia: 60,
    estado: true
  },
];

// Ventas (ejemplo)
export const ventas: Venta[] = [
  {
    id: '1',
    numeroFactura: 'F-001-2024',
    empleadoId: '1',
    usuarioId: '1',
    fecha: new Date(),
    items: [
      {
        articuloId: '1',
        cantidad: 2,
        precio: 50,
        subtotal: 100
      },
      {
        articuloId: '2',
        cantidad: 1,
        precio: 125,
        subtotal: 125
      }
    ],
    total: 225,
    estado: 'completada'
  }
];