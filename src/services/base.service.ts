import { LocalStorageService } from '@/lib/storage';

export class BaseService<T extends { id: string }> {
  constructor(private storageKey: string) {}

  getAll(): T[] {
    return LocalStorageService.getItem<T[]>(this.storageKey) || [];
  }

  getById(id: string): T | undefined {
    const items = this.getAll();
    return items.find(item => item.id === id);
  }

  create(data: Omit<T, 'id'>): T {
    const items = this.getAll();
    const newItem = {
      ...data,
      id: Date.now().toString()
    } as T;
    items.push(newItem);
    LocalStorageService.setItem(this.storageKey, items);
    return newItem;
  }

  update(id: string, data: Partial<T>): T | null {
    const items = this.getAll();
    const index = items.findIndex(item => item.id === id);
    
    if (index === -1) return null;
    
    items[index] = { ...items[index], ...data };
    LocalStorageService.setItem(this.storageKey, items);
    return items[index];
  }

  delete(id: string): boolean {
    const items = this.getAll();
    const filteredItems = items.filter(item => item.id !== id);
    
    if (items.length === filteredItems.length) return false;
    
    LocalStorageService.setItem(this.storageKey, filteredItems);
    return true;
  }

  // Método adicional para búsqueda
  search(predicate: (item: T) => boolean): T[] {
    const items = this.getAll();
    return items.filter(predicate);
  }
}