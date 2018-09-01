import { Component, OnInit } from '@angular/core';
import { ModalUsuarioConfirmacaoAbstract } from '../shared/modal-usuario-confirmacao-abstract';
import { MatDialogRef } from '@angular/material';
import { ModalCrudComponent } from '../../template/modal-crud/modal-crud.component';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuarioService } from '../usuario.service';
import { ErroValidator } from '../../template/erro-validator';

@Component({
  selector: 'app-usuario-confirmar-reset-senha',
  templateUrl: './usuario-confirmar-reset-senha.component.html',
  styleUrls: ['./usuario-confirmar-reset-senha.component.scss']
})
export class UsuarioConfirmarResetSenhaComponent extends ModalUsuarioConfirmacaoAbstract implements OnInit {


  constructor(dialogRef: MatDialogRef<ModalCrudComponent>,
              activatedRoute: ActivatedRoute,
              usuarioService: UsuarioService,
              router: Router) {
    super(dialogRef, activatedRoute, usuarioService, router);
  }

  ngOnInit(): void {
    const usuarioId: number = this._activatedRoute.snapshot.queryParams.usuarioId;
    this._recuperarUsuario(usuarioId);
  }

  onClickResetar(): void {
    /* Loading da tela */
    this.loading = true;
    /* Chama servico do backend para realizar o reset de senha  */
    this._usuarioService
      .resetDeSenha(this.usuario.id)
      .subscribe(() => {
        /* Remove loading da tela */
        this.loading = false;
        /* Volta para tela de listagem */
        this._voltarParaListagem();
      }, err => {
        /* Remove loading da tela */
        this.loading = false;
        /* Valida qual tipo de erro ocorreu */
        ErroValidator.validaErroPerfil(err, this._router);
      });
  }

}
