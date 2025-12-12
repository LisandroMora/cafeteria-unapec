export class LocalStorageService {
  static setItem(key: string, value: any): void {
    if (typeof window !== 'undefined') {
      // Convertir fechas a string antes de guardar
      const serialized = JSON.stringify(value, (key, val) => {
        if (val instanceof Date) {
          return val.toISOString();
        }
        return val;
      });
      localStorage.setItem(key, serialized);
    }
  }

  static getItem<T>(key: string): T | null {
    if (typeof window !== 'undefined') {
      const item = localStorage.getItem(key);
      if (!item) return null;
      
      // Convertir strings de fecha de vuelta a Date
      return JSON.parse(item, (key, val) => {
        if (typeof val === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(val)) {
          return new Date(val);
        }
        return val;
      });
    }
    return null;
  }

  static removeItem(key: string): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(key);
    }
  }

  static clear(): void {
    if (typeof window !== 'undefined') {
      localStorage.clear();
    }
  }
}

// Inicializar datos si no existen
export async function initializeLocalStorage() {
  if (typeof window === 'undefined') return;
  
  const mockData = await import('./mock-data');
  
  const dataMap = {
    tiposUsuarios: mockData.tiposUsuarios,
    marcas: mockData.marcas,
    campus: mockData.campus,
    proveedores: mockData.proveedores,
    cafeterias: mockData.cafeterias,
    usuarios: mockData.usuarios,
    empleados: mockData.empleados,
    articulos: mockData.articulos,
    ventas: mockData.ventas
  };

  Object.entries(dataMap).forEach(([key, data]) => {
    if (!LocalStorageService.getItem(key) && data) {
      LocalStorageService.setItem(key, data);
    }
  });
}

// Función para exportar todos los datos
export function exportData(): string {
  const data: any = {};
  const keys = [
    'tiposUsuarios',
    'marcas',
    'campus',
    'proveedores',
    'cafeterias',
    'usuarios',
    'empleados',
    'articulos',
    'ventas'
  ];
  
  keys.forEach(key => {
    data[key] = LocalStorageService.getItem(key);
  });
  
  return JSON.stringify(data, null, 2);
}

// Función para importar datos
export function importData(jsonData: string): boolean {
  try {
    const data = JSON.parse(jsonData);
    Object.entries(data).forEach(([key, value]) => {
      if (value) {
        LocalStorageService.setItem(key, value);
      }
    });
    return true;
  } catch (error) {
    console.error('Error importing data:', error);
    return false;
  }
}