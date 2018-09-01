import { Component, OnInit } from '@angular/core';
import { ModalClose } from '../../template/modal-close';
import { MatDialogRef } from '@angular/material';
import { ModalCrudComponent } from '../../template/modal-crud/modal-crud.component';
import { ActivatedRoute, Router } from '@angular/router';
import { trigger } from '@angular/animations';
import { Animations } from '../../../shared/util/animations';
import { ModalType } from '../../template/modal-header/modal-header.component';

export enum TipoAcaoUsuario {
  CRIAR_USUARIO = 'criar_usuario',
  EDITAR_USUARIO = 'editar_usuario',
  ERRO_USUARIO = 'erro_usuario',
  USUARIO_CRIADO_COM_SUCESSO = 'usuario_criado_com_sucesso',
  USUARIO_EDITADO_COM_SUCESSO = 'usuario_editado_com_sucesso'
}

@Component({
  selector: 'app-usuario-modal-inicial',
  templateUrl: './usuario-modal-inicial.component.html',
  styleUrls: ['./usuario-modal-inicial.component.scss'],
  animations: [
    trigger('slideInOut', Animations.slideInOut)
  ]
})
export class UsuarioModalInicialComponent extends ModalClose implements OnInit {
  TipoAcaoUsuario = TipoAcaoUsuario;
  ModalType = ModalType;
  tipoAcaoSelecionada: TipoAcaoUsuario;
  nomeUsuario: string;

  constructor(protected dialogRef: MatDialogRef<ModalCrudComponent>,
              private _router: Router,
              private _activatedRoute: ActivatedRoute) {
    super(dialogRef);
  }

  onClickOpcao(tipoAcao: TipoAcaoUsuario): void {
    this._router.navigate([], { queryParams: { tipoAcaoUsuario: tipoAcao } });
  }

  onClickFecharOpcao(): void {
    this._router.navigate([], { queryParams: { tipoAcaoUsuario: null } });
  }

  ngOnInit(): void {
    this._activatedRoute
      .queryParams
      .subscribe(query => {
        this.tipoAcaoSelecionada = query.tipoAcaoUsuario;
        this.nomeUsuario = query.nomeUsuario;
      });
  }

}
