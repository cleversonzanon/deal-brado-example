import { Component, OnInit } from '@angular/core';
import { ModalClose } from '../../template/modal-close';
import { MatDialogRef } from '@angular/material';
import { ModalCrudComponent } from '../../template/modal-crud/modal-crud.component';
import { ModalType } from '../../template/modal-header/modal-header.component';

enum TipoParametrizacao {
  TEMPO_INATIVIDADE,
  CONFIGURACAO_EMAIL,
  IMAGENS_EMAIL,
  TERMO_USO,
  TELAS_SISTEMA,
  TELAS_APP
}

@Component({
  selector: 'app-parametros-modal-inicial',
  templateUrl: './parametros-modal-inicial.component.html',
  styleUrls: ['./parametros-modal-inicial.component.scss']
})
export class ParametrosModalInicialComponent extends ModalClose implements OnInit {
  ModalType = ModalType;
  TipoParametrizacao = TipoParametrizacao;

  step: TipoParametrizacao;

  constructor(protected dialogRef: MatDialogRef<ModalCrudComponent>) {
    super(dialogRef);
  }

  ngOnInit() {
  }

  setStep(tipo: TipoParametrizacao) {
    this.step = tipo;
  }

  closeStep(): void {
    this.step = null;
  }

}
