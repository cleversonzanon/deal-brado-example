import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { LoginResponse } from '../../auth/domains/login-response';
import { MatDialog } from '@angular/material';
import { ModalTermoAceiteComponent } from '../modal-termo-aceite/modal-termo-aceite.component';
import { ModalCrudComponent } from '../template/modal-crud/modal-crud.component';
import { MediaChange, ObservableMedia } from '@angular/flex-layout';
import { Subscription } from 'rxjs/internal/Subscription';

interface OpcaoModulos {
  titulo: string;
  descricao: string;
  icon: string;
}

@Component({
  selector: 'app-home-modulos',
  templateUrl: './home-modulos.component.html',
  styleUrls: ['./home-modulos.component.scss']
})
export class HomeModulosComponent implements OnInit, OnDestroy {

  opcoesModulos: OpcaoModulos[] = [
    {
      titulo: 'admin-modulos.modulos.administracao',
      descricao: 'admin-modulos.modulos-descricao.administracao',
      icon: 'modulo-adm'
    },
    {
      titulo: 'admin-modulos.modulos.ppr',
      descricao: 'admin-modulos.modulos-descricao.ppr',
      icon: 'modulo-ppr'
    },
    {
      titulo: 'admin-modulos.modulos.telefonia',
      descricao: 'admin-modulos.modulos-descricao.telefonia',
      icon: 'modulo-telefonia'
    },
    {
      titulo: 'admin-modulos.modulos.portal',
      descricao: 'admin-modulos.modulos-descricao.portal',
      icon: 'modulo-webrado'
    },
  ];

  mediaWatcher: Subscription;
  imgeSize = 'sm';

  constructor(private _authService: AuthService,
              private _media: ObservableMedia,
              private _dialog: MatDialog,
              private _router: Router) {

    // Watcher para size da tela (imagem de slide)
    this.mediaWatcher = _media.subscribe((change: MediaChange) => {
      this.imgeSize = change.mqAlias;
    });
  }

  ngOnInit(): void {
    this._validaTermoAceite();
  }

  ngOnDestroy(): void {
    this.mediaWatcher.unsubscribe();
  }

  getUrlImage(): string {
    let size = this.imgeSize;
    if (size === 'xs') {
      size = 'sm';
    }
    if (size === 'xl') {
      size = 'lg';
    }
    return `../../../assets/background-imagens/home-admin/background-${size}.jpg`;
  }

  onClickAbrirFuncionalidade(event: Event, modalFuncionalidade: string): void {
    event.preventDefault();
    this._router.navigate([{ outlets: { modal: modalFuncionalidade } }]);
    this._abrirModal();
  }

  private _validaTermoAceite() {
    // Recupera token do localStorage
    const userToken = this._authService.getUserToken();
    // Valida se o termo foi aceito pelo usuario
    if (userToken.termAccepted) {
      // chama metodo para validar quantos modulos o usuario tem
      this._validaModulosUsuario(userToken);
    } else {
      // Exibe modal para eceite do usuario do termo
      setTimeout(() => this._dialog.open(ModalTermoAceiteComponent, {
        disableClose: true,
        panelClass: 'modal-termo-border',
        data: {
          userToken
        }
      }));
    }
  }

  private _validaModulosUsuario(usuarioToken: LoginResponse) {
    if (usuarioToken.modules.length === 1) {
      console.log(`tem apenas um modulo: ${usuarioToken.modules[0]}`);
      // Caso o usuario só tenha um modulo, redireciona ele para o modulo @TODO
      // @TODO pegar rota do backend? ou validar qual path redirecionar
      // this._router.navigate(['/admin/modulos']);
    }
  }

  private _abrirModal() {
    const modal = this._dialog.open(ModalCrudComponent, {
      disableClose: true,
      panelClass: 'modal-perfil-border'
    });
    modal.afterClosed()
      .subscribe(() => {
        this._router.navigate([{ outlets: { modal: null } }]);
      });
  }
}
