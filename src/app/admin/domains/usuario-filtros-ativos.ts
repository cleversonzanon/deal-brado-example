import { PerfilSuggest } from './perfil-suggest';
import { Terminal } from './terminal';
import { UnidadeServico } from './unidade-servico';
import { TipoUsuario } from './enum/tipo-usuario';

export interface UsuarioFiltrosAtivos {
  ativo: boolean;
  nome: string;
  perfilAutorizacao: PerfilSuggest[];
  tipoUsuario: TipoUsuario[];
  terminais: Terminal[];
  unidadeDeServico: UnidadeServico[];
}
