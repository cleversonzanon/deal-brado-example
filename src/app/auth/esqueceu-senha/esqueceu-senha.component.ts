import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-esqueceu-senha',
  templateUrl: './esqueceu-senha.component.html',
  styleUrls: ['./esqueceu-senha.component.scss']
})
export class EsqueceuSenhaComponent implements OnInit {

  esqueceuSenhaForm: FormGroup;
  loading = false;
  formSubmited = false;
  emailInvalido = false;

  constructor(private _formBuilder: FormBuilder,
              private _authService: AuthService) {
  }

  submitRecuperarSenha(): void {
    this.loading = true;
    this.emailInvalido = false;

    this._authService
      .recuperarSenha(this.esqueceuSenhaForm.value)
      .subscribe(() => {
        this.loading = false;
        this.formSubmited = true;
      }, err => {
        console.error(err);
        this.emailInvalido = true;
        this.loading = false;
      });
  }

  ngOnInit(): void {
    this.esqueceuSenhaForm = this._formBuilder.group({
      email: [null, [
        Validators.required,
        Validators.email
      ]]
    });
  }
}
