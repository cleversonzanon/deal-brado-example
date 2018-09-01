import { TipoUsuario } from './enum/tipo-usuario';

export interface EmpresaSuggest {
  id: number;
  name: string;
  tipo: TipoUsuario;
}
