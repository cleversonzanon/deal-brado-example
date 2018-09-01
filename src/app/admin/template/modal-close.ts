import { MatDialogRef } from '@angular/material';
import { ModalCrudComponent } from './modal-crud/modal-crud.component';

export abstract class ModalClose {

  protected constructor(private _dialogRef: MatDialogRef<ModalCrudComponent>) {
  }

  onClickClose(): void {
    this._dialogRef.close();
  }
}
