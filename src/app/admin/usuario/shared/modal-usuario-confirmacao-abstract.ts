import { ModalClose } from '../../template/modal-close';
import { ModalCrudComponent } from '../../template/modal-crud/modal-crud.component';
import { MatDialogRef } from '@angular/material';
import { ErroValidator } from '../../template/erro-validator';
import { ModalType } from '../../template/modal-header/modal-header.component';
import { UsuarioDto } from '../../domains/usuario-dto';
import { UsuarioService } from '../usuario.service';
import { ActivatedRoute, Router } from '@angular/router';

export class ModalUsuarioConfirmacaoAbstract extends ModalClose {
  ModalType = ModalType;
  loading = true;
  usuario: UsuarioDto;

  constructor(protected dialogRef: MatDialogRef<ModalCrudComponent>,
              protected _activatedRoute: ActivatedRoute,
              protected _usuarioService: UsuarioService,
              protected _router: Router) {
    super(dialogRef);
  }

  _recuperarUsuario(idUsuario: number) {
    /* Servico para recuperar informacoes do usuario */
    this._usuarioService
      .recuperarPreview(idUsuario)
      .subscribe(usuario => {
        /* Seta o usuario recuperado do backend */
        this.usuario = usuario;
        /* Remove loading */
        this.loading = false;
      }, err => {
        /* Remove loading */
        this.loading = false;
        /* Valida qual tipo de erro ocorreu */
        ErroValidator.validaErroUsuario(err, this._router);
      });
  }

  onClickCancelar(): void {
    this._voltarParaListagem();
  }

  _voltarParaListagem(): void {
    this._router.navigate(
      [{ outlets: { modal: 'usuario-listar' } }],
      {
        queryParamsHandling: 'merge',
        queryParams: {
          'usuarioId': null,
        },
      }
    );
  }
}
