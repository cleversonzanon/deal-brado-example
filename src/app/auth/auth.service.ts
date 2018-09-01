import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UsuarioLogin } from './domains/usuario-login';
import { LoginResponse } from './domains/login-response';
import { HttpClient } from '@angular/common/http';
import { EsqueceuSenha } from './domains/esqueceu-senha';
import { PasswordToken } from './domains/password-token';
import { NovaSenha } from './domains/nova-senha';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { BrdHttpGestaoAcessoAbstract } from '../shared/util/http/brd-http-gestao-acesso.abstract';

@Injectable({
  providedIn: 'root'
})
export class AuthService extends BrdHttpGestaoAcessoAbstract {
  private static TOKEN_USUARIO = 'TOKEN_USUARIO';
  private static URL_AUTH = `auth`;
  private static URL_PASSWORD = `password`;

  constructor(protected http: HttpClient,
              private _router: Router) {
    super(http);
  }

  login(usuario: UsuarioLogin): Observable<LoginResponse> {
    const url = `${this._getUrlBase()}${AuthService.URL_AUTH}/login`;
    return this._http
      .post<LoginResponse>(
        url,
        usuario,
      ).pipe(
        map(resp => {
          // Salva o token no LocalStorage
          this._setTokenLocalStorage(resp);
          // Navega para tela de modulos
          this._router.navigate(['/admin']);
          // Retorna resposta para observalbe
          return resp;
        })
      );
  }

  logout(): Observable<any> {
    const url = `${this._getUrlBase()}${AuthService.URL_AUTH}/logout`;
    return this._http
      .get<any>(url)
      .pipe(
        map(resp => {
          // Remove o token do usuario do localStorage
          this.removeTokenLocalStorage();
          // Navega para tela de modulos
          this._router.navigate(['/login']);
          // Retorna resposta para observalbe
          return resp;
        })
      );
  }

  recuperarSenha(esqueceuSenha: EsqueceuSenha): Observable<any> {
    const url = `${this._getUrlBase()}${AuthService.URL_PASSWORD}/reset`;
    return this._http
      .post<any>(url, esqueceuSenha);
  }

  getPasswordToken(token: string): Observable<PasswordToken> {
    const url = `${this._getUrlBase()}${AuthService.URL_PASSWORD}/token/${token}`;
    return this._http
      .get<PasswordToken>(url);
  }

  trocarSenha(novaSenha: NovaSenha): Observable<any> {
    const url = `${this._getUrlBase()}${AuthService.URL_PASSWORD}/change`;
    return this._http
      .post<any>(url, novaSenha);
  }

  getUserToken(): LoginResponse {
    return <LoginResponse> JSON.parse(localStorage.getItem(AuthService.TOKEN_USUARIO));
  }

  getToken(): string {
    try {
      // Recupera o token completo do usuario
      const userToken = this.getUserToken();
      // Retorna apenas o token utilizado para validacao de autenticacao
      return userToken.token;
    } catch (e) {
      // Caso não tenha o atributo no localStorage retorna valor null
      return null;
    }
  }

  private _setTokenLocalStorage(token: LoginResponse): void {
    localStorage.setItem(AuthService.TOKEN_USUARIO, JSON.stringify(token));
  }

  atualizarTermoAceite(): void {
    const tokenUsuario = this.getUserToken();
    tokenUsuario.termAccepted = true;
    this._setTokenLocalStorage(tokenUsuario);
  }

  removeTokenLocalStorage() {
    localStorage.removeItem(AuthService.TOKEN_USUARIO);
  }
}
