import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { AuthService } from '../auth.service';
import { ANIMATION_TYPES } from 'ngx-loading';
import { Router } from '@angular/router';
import { MediaChange, ObservableMedia } from '@angular/flex-layout';
import { Subscription } from 'rxjs/internal/Subscription';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [
    trigger('fade', [
      state('in', style({ 'opacity': '1' })),
      state('out', style({ 'opacity': '0' })),
      transition('* <=> *', [
        animate(LoginComponent.TIME_EFFECT)
      ])
    ])
  ]
})
export class LoginComponent implements OnInit, OnDestroy {
  private static TIME_EFFECT = 150;
  listaImagens = [
    '../../assets/background-imagens/login/slide1',
    '../../assets/background-imagens/login/slide2',
    '../../assets/background-imagens/login/slide3',
    '../../assets/background-imagens/login/slide4',
  ];
  stepAtual = 0;
  fadeFlag = 'in';

  loginForm: FormGroup;
  loading = false;
  loadingConfig = { animationType: ANIMATION_TYPES.threeBounce };
  loginInvalido = false;
  mediaWatcher: Subscription;
  imgeSize = 'sm';

  constructor(private _auth: AuthService,
              private _router: Router,
              private _media: ObservableMedia,
              private _formBuilder: FormBuilder) {

    // Watcher para size da tela (imagem de slide)
    this.mediaWatcher = _media.subscribe((change: MediaChange) => {
      this.imgeSize = change.mqAlias;
    });
  }

  ngOnInit(): void {
    // Remove o token do usuario do local storage (caso exista)
    this._auth.removeTokenLocalStorage();
    // Build do form de login
    this._buildForm();
  }

  ngOnDestroy(): void {
    this.mediaWatcher.unsubscribe();
  }

  submitLogin(): void {
    this.loginInvalido = false;
    this.loading = true;
    this._auth
      .login(this.loginForm.value)
      .subscribe(() => {
        this.loading = false;
      }, err => {
        console.error(err);
        this.loading = false;
        this.loginInvalido = true;
      });
  }

  onClickAnterior(): void {
    this.fadeFlag = 'out';
    setTimeout(() => {
      this.fadeFlag = 'in';
      if (this.stepAtual === 0) {
        this.stepAtual = this.listaImagens.length - 1;
      } else {
        this.stepAtual--;
      }
    }, LoginComponent.TIME_EFFECT);

  }

  onClickProximo(): void {
    this.fadeFlag = 'out';
    setTimeout(() => {
      this.fadeFlag = 'in';
      if (this.stepAtual === (this.listaImagens.length - 1)) {
        this.stepAtual = 0;
      } else {
        this.stepAtual++;
      }
    }, LoginComponent.TIME_EFFECT);
  }

  onClickStepPosition(position: number): void {
    this.stepAtual = position;
  }

  getUrlImage(): string {
    let size = this.imgeSize;
    if (size === 'xs') {
      size = 'sm';
    }
    if (size === 'xl') {
      size = 'lg';
    }
    return `${this.listaImagens[this.stepAtual]}-${size}.jpg`;
  }

  private _buildForm() {
    this.loginForm = this._formBuilder.group({
      email: ['adams.lucass@gmail.com', [
        Validators.required,
        Validators.email
      ]],
      password: ['Senha@123', [
        Validators.required
      ]]
    });
  }
}
