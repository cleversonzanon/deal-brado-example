import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { ModalCrudComponent } from '../../template/modal-crud/modal-crud.component';
import { ModalUsuarioConfirmacaoAbstract } from '../shared/modal-usuario-confirmacao-abstract';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuarioService } from '../usuario.service';
import { ErroValidator } from '../../template/erro-validator';

@Component({
  selector: 'app-usuario-confirmar-inativacao',
  templateUrl: './usuario-confirmar-inativacao.component.html',
  styleUrls: ['./usuario-confirmar-inativacao.component.scss']
})
export class UsuarioConfirmarInativacaoComponent extends ModalUsuarioConfirmacaoAbstract implements OnInit {


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

  onClickInativar(): void {
    /* Loading da tela de inativacao */
    this.loading = true;
    /* Chama servico do backend para realizar a inativacao */
    this._usuarioService
      .inativar(this.usuario.id)
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
