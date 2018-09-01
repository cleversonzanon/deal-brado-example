import { TipoAcao } from '../perfil/perfil-modal-inicial/perfil-modal-inicial.component';
import { TipoAcaoUsuario } from '../usuario/usuario-modal-inicial/usuario-modal-inicial.component';

export abstract class ErroValidator {
  static validaErroPerfil(e, router) {
    console.error(e);

    /* validacao de status (500) -> redirect para tela inicial com robo */
    if (e.status === 500) {
      router.navigate(
        [{ outlets: { modal: 'modal-perfil-inicial' } }],
        { queryParams: { tipoAcao: TipoAcao.ERRO_PERFIL } }
      );
    }
  }

  static validaErroUsuario(e, router) {
    console.error(e);

    /* validacao de status (500) -> redirect para tela inicial com robo */
    if (e.status === 500) {
      router.navigate(
        [{ outlets: { modal: 'modal-usuario-inicial' } }],
        { queryParams: { tipoAcaoUsuario: TipoAcaoUsuario.ERRO_USUARIO } }
      );
    }
  }
}
