import { Component, OnInit } from '@angular/core';
import { ModalClose } from '../../template/modal-close';
import { MatDialogRef } from '@angular/material';
import { ModalCrudComponent } from '../../template/modal-crud/modal-crud.component';
import { ActivatedRoute, Router } from '@angular/router';
import { PerfilService } from '../perfil.service';
import { ErroValidator } from '../../template/erro-validator';

@Component({
  selector: 'app-perfil-confirmar-inativacao',
  templateUrl: './perfil-confirmar-inativacao.component.html',
  styleUrls: ['./perfil-confirmar-inativacao.component.scss']
})
export class PerfilConfirmarInativacaoComponent extends ModalClose implements OnInit {
  loading = false;
  perfil = {
    perfilName: '',
    perfilId: null,
  };

  constructor(protected dialogRef: MatDialogRef<ModalCrudComponent>,
              private _perfilService: PerfilService,
              private _activatedRoute: ActivatedRoute,
              private _router: Router) {
    super(dialogRef);
  }

  ngOnInit(): void {
    this.perfil = {
      perfilName: this._activatedRoute.snapshot.queryParams['perfil-name'],
      perfilId: this._activatedRoute.snapshot.queryParams['perfil-id']
    };
  }

  onClickInativar(): void {
    this.loading = true;
    this._perfilService
      .inativar(this.perfil.perfilId)
      .subscribe(() => {
        this.loading = false;
        this._voltarParaListagem();
      }, err => {
        this.loading = false;
        /* Valida qual tipo de erro ocorreu */
        ErroValidator.validaErroPerfil(err, this._router);
      });
  }

  onClickCancelar(): void {
    this._voltarParaListagem();
  }

  private _voltarParaListagem(): void {
    this._router.navigate(
      [{ outlets: { modal: 'perfil-listar' } }],
      {
        queryParamsHandling: 'merge',
        queryParams: {
          'perfil-name': null,
          'perfil-id': null
        },
      }
    );
  }
}
