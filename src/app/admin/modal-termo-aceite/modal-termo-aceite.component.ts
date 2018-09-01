import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { AuthService } from '../../auth/auth.service';
import { UsuarioService } from '../usuario/usuario.service';

@Component({
  selector: 'app-modal-termo-aceite',
  templateUrl: './modal-termo-aceite.component.html',
  styleUrls: ['./modal-termo-aceite.component.scss']
})
export class ModalTermoAceiteComponent implements OnInit {
  public termoAceito: FormControl;
  public loading = false;

  constructor(@Inject(MAT_DIALOG_DATA) private _data: any,
              private _dialogRef: MatDialogRef<ModalTermoAceiteComponent>,
              private _authService: AuthService,
              private _usuarioService: UsuarioService) {
  }

  ngOnInit(): void {
    this.termoAceito = new FormControl(false);
  }

  onClickRecusarTermpo(): void {
    // Exibe o loading na tela
    this.loading = true;
    // Chamada de serviço para remover o usuario da sessao
    this._authService
      .logout()
      .subscribe(() => {
        // Remove Loading da tela
        this.loading = false;
      }, err => console.error(err));
  }

  onClickAceitarTermpo(): void {
    // Exibe o loading na tela
    this.loading = true;
    // Atualiza a flag de aceite no backend
    this._usuarioService
      .aceitarTermo(this._data.userToken.email)
      .subscribe(() => {
        // Atualiza a flag do termo no localStorage para TRUE
        this._authService.atualizarTermoAceite();
        // Remove Loading da tela
        this.loading = false;
        // Fecha a modal com o termo de uso
        this._dialogRef.close();
      }, err => {
        console.error(err);
        // Remove Loading da tela
        this.loading = false;
      });
  }
}
