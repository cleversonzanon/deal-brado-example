import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { LoginResponse } from '../auth/domains/login-response';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu-de-modulos',
  templateUrl: './menu-de-modulos.component.html',
  styleUrls: ['./menu-de-modulos.component.scss']
})
export class MenuDeModulosComponent implements OnInit {

  constructor(private _authService: AuthService,
              private _router: Router) {
  }

  ngOnInit(): void {
    this._validaTermoAceite();
  }

  private _validaTermoAceite() {
    const userToken = this._authService.getUserToken();
    console.log(userToken);
    if (userToken.termAccepted) {
      this._validaModulosUsuario(userToken);
    } else {
      console.log('show modal');
      // Exibi modal de confirmacao do termo de uso @TODO
    }
  }

  private _validaModulosUsuario(usuarioToken: LoginResponse) {
    if (usuarioToken.modules.length === 1) {
      // Caso o usuario só tenha um modulo, redireciona ele para o modulo @TODO
      this._router.navigate(['/app/modulos']);
    }
  }
}
