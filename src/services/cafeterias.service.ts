import { Cafeteria } from '@/types';
import { BaseService } from './base.service';

class CafeteriasServiceClass extends BaseService<Cafeteria> {
  constructor() {
    super('cafeterias');
  }
  
  getByCampus(campusId: string): Cafeteria[] {
    return this.search(cafeteria => cafeteria.campusId === campusId);
  }
}

export const CafeteriasService = new CafeteriasServiceClass();