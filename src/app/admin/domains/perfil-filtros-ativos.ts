import { Modulo } from './modulo';

export interface PerfilFiltrosAtivos {
  ativo: boolean;
  nome: string;
  modulos: Modulo[];
}
