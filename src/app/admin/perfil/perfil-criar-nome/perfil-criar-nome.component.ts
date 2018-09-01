import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PerfilService } from '../perfil.service';
import { NomeValidator } from '../../domains/nome-validator';
import { Router } from '@angular/router';
import { ErroValidator } from '../../template/erro-validator';

@Component({
  selector: 'app-perfil-criar-nome',
  templateUrl: './perfil-criar-nome.component.html',
  styleUrls: ['./perfil-criar-nome.component.scss']
})
export class PerfilCriarNomeComponent implements OnInit {
  @Output() clickVoltar: EventEmitter<any> = new EventEmitter<any>();
  perfilForm: FormGroup;
  submitLoading = false;
  errorForm = null;

  constructor(private _formBuilder: FormBuilder,
              private _router: Router,
              private _perfilService: PerfilService) {
  }

  ngOnInit(): void {
    // Build do form de perfil
    this._buildForm();
  }

  submitPerfil() {
    this.submitLoading = true;
    this.errorForm = null;
    const nomeValidator = <NomeValidator>this.perfilForm.value;
    this._perfilService
      .validarNome(nomeValidator)
      .subscribe(() => {
        this.submitLoading = false;
        // Redireciona para a tela de seleção dos modulos
        this._router.navigate(
          [{ outlets: { modal: 'perfil-escolher-modulos' } }],
          {
            queryParams: {
              name: nomeValidator.name
            }
          }
        );
      }, err => {
        this.errorForm = err.error.messages[0].message;
        this.submitLoading = false;

        /* Valida qual tipo de erro ocorreu */
        ErroValidator.validaErroPerfil(err, this._router);
      });
  }

  onClickVoltar(event: Event): void {
    event.stopPropagation();
    this.clickVoltar.emit();
  }

  private _buildForm() {
    this.perfilForm = this._formBuilder.group({
      name: [null, [
        Validators.required,
      ]]
    });
  }
}
