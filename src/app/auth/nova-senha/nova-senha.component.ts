import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

import * as stringSimilarity from 'string-similarity';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { PasswordToken } from '../domains/password-token';
import { NovaSenha } from '../domains/nova-senha';

enum ErrorType {
  NADA_LEMBRE_LOGIN = 'nada_lembre_login',
  DIFERENTE_ANTERIOR = 'diferente_anterior',
  MINUSCULO = 'minusculo',
  CARACTERES_ESPECIAIS = 'caracteres_especiais',
  MAIUSCULO = 'maiusculo',
  NUMERO = 'numero',
  LENGTH = 'length',
  SENHAS_DIFERENTES = 'senhas_diferentes'
}

@Component( {
  selector: 'app-nova-senha',
  templateUrl: './nova-senha.component.html',
  styleUrls: [ './nova-senha.component.scss' ]
} )
export class NovaSenhaComponent implements OnInit {
  ErrorType = ErrorType;
  REGEX_MAIUSCULO = /^(?=.*?[A-Z])/;
  REGEX_MINUSCULO = /^(?=.*?[a-z])/;
  REGEX_NUMEROS = /^(?=.*?[0-9])/;
  REGEX_CARACTERES_ESPECIAIS = /^(?=.*?[#?!@$%^&*-])/;
  requisitosDeSenha = [ {
    label: 'nova-senha.requisitos.minimo-oito-caracteres',
    errorType: ErrorType.LENGTH,
  }, {
    label: 'nova-senha.requisitos.caracteres-maiusculos',
    errorType: ErrorType.MAIUSCULO,
  }, {
    label: 'nova-senha.requisitos.caracteres-minusculos',
    errorType: ErrorType.MINUSCULO,
  }, {
    label: 'nova-senha.requisitos.numeros',
    errorType: ErrorType.NUMERO,
  }, {
    label: 'nova-senha.requisitos.caracteres-especiais',
    errorType: ErrorType.CARACTERES_ESPECIAIS,
  }, {
    label: 'nova-senha.requisitos.nada-lembre-login',
    errorType: ErrorType.NADA_LEMBRE_LOGIN,
  }, {
    label: 'nova-senha.requisitos.senha-distinta',
    errorType: ErrorType.DIFERENTE_ANTERIOR,
  } ];
  showPassword = false;
  formSubmited = false;
  loading = false;
  novaSenhaForm: FormGroup;
  passwordToken: PasswordToken;

  constructor( private _formBuilder: FormBuilder,
               private _activatedRoute: ActivatedRoute,
               private _router: Router,
               private _authService: AuthService ) {
  }

  ngOnInit(): void {
    this._createForm();
    this._getPasswordToken();
  }

  onSubmitForm(): void {
    this.loading = true;
    const novaSenha = <NovaSenha>{
      email: this.passwordToken.email,
      passwordToken: this.passwordToken.passwordToken,
      password: this.novaSenhaForm.get( 'newpassword' ).value
    };
    // Redirecionar para o login
    this._authService
      .trocarSenha( novaSenha )
      .subscribe( () => {
        // remove loading da tela
        this.loading = false;
        // status do form (efeito de tela para exibir msg de sucesso)
        this.formSubmited = true;

        // Remove o token do objeto sobmetido a troca de senha para enviar para o login
        delete novaSenha.passwordToken;

        // Deley para fazer login (efeito de tela de reset com sucesso)
        setTimeout( () => {
          // Efetua login no sistema
          this._authService
            .login( novaSenha )
            .subscribe(
              () => console.log( 'Login' ),
              err => console.error( err )
            );
        }, 3000 );
      }, err => {
        // @TODO validar erro na troca de senha...
        this.loading = false;
        console.error( err );
      } );
  }

  private _createForm(): void {
    this.novaSenhaForm = this._formBuilder.group( {
        newpassword: [ null,
          [
            Validators.required,
            this._minLengthValidator( 8, { [ ErrorType.LENGTH ]: true } ),
            this._diferneteDaAnterior( { [ ErrorType.DIFERENTE_ANTERIOR ]: true } ),
            this._nadaQueLembreLogin( { [ ErrorType.NADA_LEMBRE_LOGIN ]: true } ),
            this._regexValidator( new RegExp( this.REGEX_NUMEROS ), { [ ErrorType.NUMERO ]: true } ),
            this._regexValidator( new RegExp( this.REGEX_MAIUSCULO ), { [ ErrorType.MAIUSCULO ]: true } ),
            this._regexValidator( new RegExp( this.REGEX_MINUSCULO ), { [ ErrorType.MINUSCULO ]: true } ),
            this._regexValidator(
              new RegExp( this.REGEX_CARACTERES_ESPECIAIS ),
              { [ ErrorType.CARACTERES_ESPECIAIS ]: true }
            ),
          ]
        ],
        newpasswordconfirm: [ null,
          [
            Validators.required,
            this._minLengthValidator( 8, { [ ErrorType.LENGTH ]: true } ),
            this._senhasIguaisValidator( { [ ErrorType.SENHAS_DIFERENTES ]: true } )
          ]
        ]
      }
    );
  }

  private _regexValidator( regex: RegExp, error: ValidationErrors ): ValidatorFn {
    return ( control: AbstractControl ): { [ key: string ]: any } => {
      if ( !control.value ) {
        return error;
      }
      return regex.test( control.value ) ? null : error;
    };
  }

  private _minLengthValidator( number: number, error: ValidationErrors ): ValidatorFn {
    return ( control: AbstractControl ): { [ key: string ]: any } => {
      if ( !control.value ) {
        return error;
      }
      return control.value.length <= number ? error : null;
    };
  }

  // @TODO colocar async
  private _diferneteDaAnterior( error: ValidationErrors ): ValidatorFn {
    return ( control: AbstractControl ): { [ key: string ]: any } => {
      if ( !control.value || control.value.length <= 8 ) {
        return error;
      }
      // @TODO validar com senha anterior
      return null;
    };
  }

  private _nadaQueLembreLogin( error: ValidationErrors ): ValidatorFn {
    return ( control: AbstractControl ): { [ key: string ]: any } => {
      if ( !control.value || control.value.length <= 8 ) {
        return error;
      }

      const passwordSimilarity = stringSimilarity.compareTwoStrings( control.value, this.passwordToken.email ) * 100;
      console.log( `Password similarity: ${passwordSimilarity}` );
      return passwordSimilarity >= this.passwordToken.passwordSimilarity ? error : null;
    };
  }

  private _senhasIguaisValidator( error: ValidationErrors ): ValidatorFn {
    return ( control: AbstractControl ): { [ key: string ]: any } => {
      if ( !control.value ) {
        return null;
      }
      const password = this.novaSenhaForm.get( 'newpassword' ).value;
      return ( password === control.value ) ? null : error;
    };
  }

  private _getPasswordToken(): void {
    const isMobile = /Android|iPhone/i.test( window.navigator.userAgent );
    if ( !isMobile ) {
      this._activatedRoute.params
        .subscribe( params => {
          this._authService
            .getPasswordToken( params.token )
            .subscribe( passwordToken => {
              this.passwordToken = passwordToken;
            }, err => {
              console.error( err );
              // @TODO caso retorne erro qual o tratamento (ex: token ja utilizado ou token não existe) ???

              // Navega para login caso de erro
              // this._router.navigate(['/']);
            } );
        } );
    } else {
      /**
       * @TODO abrir aplicativo/pwa/store
       */
    }
  }
}
