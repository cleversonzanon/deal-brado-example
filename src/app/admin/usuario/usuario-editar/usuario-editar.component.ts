import { Component } from '@angular/core';
import { ModalClose } from '../../template/modal-close';
import { MatDialogRef } from '@angular/material';
import { ModalCrudComponent } from '../../template/modal-crud/modal-crud.component';
import { ModalType } from '../../template/modal-header/modal-header.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-usuario-editar',
  templateUrl: './usuario-editar.component.html',
  styleUrls: ['./usuario-editar.component.scss']
})
export class UsuarioEditarComponent extends ModalClose {
  ModalType = ModalType;

  constructor(protected dialogRef: MatDialogRef<ModalCrudComponent>,
              private _router: Router) {
    super(dialogRef);
  }

  onClickVoltar(): void {
    this._router.navigate(
      [{ outlets: { modal: 'usuario-listar' } }],
      {
        queryParams: {
          'usuarioId': null
        },
        queryParamsHandling: 'merge'
      });
  }

}
