import { Funcionalidade } from './funcionalidade';

export interface Modulo {
  id: number;
  name: string;
  functionalityList: Funcionalidade[];
}
