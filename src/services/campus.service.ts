import { Campus } from '@/types';
import { BaseService } from './base.service';

class CampusServiceClass extends BaseService<Campus> {
  constructor() {
    super('campus');
  }
}

export const CampusService = new CampusServiceClass();