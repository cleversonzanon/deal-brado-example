import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { ModalCrudComponent } from '../../template/modal-crud/modal-crud.component';
import { trigger } from '@angular/animations';
import { Animations } from '../../../shared/util/animations';
import { ModalClose } from '../../template/modal-close';
import { ActivatedRoute, Router } from '@angular/router';

export enum TipoAcao {
  CRIAR_PERFIL = 'criar_perfil',
  EDITAR_PERFIL = 'editar_perfil',
  ERRO_PERFIL = 'erro_perfil'
}

@Component({
  selector: 'app-perfil-modal-inicial',
  templateUrl: './perfil-modal-inicial.component.html',
  styleUrls: ['./perfil-modal-inicial.component.scss'],
  animations: [
    trigger('slideInOut', Animations.slideInOut)
  ]
})
export class PerfilModalInicialComponent extends ModalClose implements OnInit {
  TipoAcao = TipoAcao;
  tipoAcaoSelecionado: TipoAcao;

  constructor(protected dialogRef: MatDialogRef<ModalCrudComponent>,
              private _router: Router,
              private _activatedRoute: ActivatedRoute) {
    super(dialogRef);
  }

  onClickOpcao(tipoAcao: TipoAcao): void {
    this._router.navigate([], { queryParams: { tipoAcao } });
  }

  onClickFecharOpcao(): void {
    this._router.navigate([], { queryParams: { tipoAcao: null } });
  }

  ngOnInit(): void {
    this._activatedRoute
      .queryParams
      .subscribe(query => this.tipoAcaoSelecionado = query.tipoAcao);
  }

}
