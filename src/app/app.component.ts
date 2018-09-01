import { Component, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { NgxPermissionsService } from 'ngx-permissions';

// import { introGuide } from 'src/assets/js/intro-guide-js.js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  svgIconsList = [{
    nome: 'brd-cadiado',
    url: '../assets/icons/Lock.svg'
  }, {
    nome: 'brd-usuario',
    url: '../assets/icons/User.svg'
  }, {
    nome: 'brd-login-seta',
    url: '../assets/icons/Loginseta.svg'
  }, {
    nome: 'brd-slider-left',
    url: '../assets/icons/SliderLeft.svg'
  }, {
    nome: 'brd-slider-right',
    url: '../assets/icons/SliderRight.svg'
  }, {
    nome: 'modulo-adm',
    url: '../assets/icons/modulo-adm.svg'
  }, {
    nome: 'modulo-adm-cinza',
    url: '../assets/icons/modulo-adm-cinza.svg'
  }, {
    nome: 'modulo-adm-laranja',
    url: '../assets/icons/modulo-adm-laranja.svg'
  }, {
    nome: 'modulo-ppr',
    url: '../assets/icons/modulo-ppr.svg'
  }, {
    nome: 'modulo-ppr-cinza',
    url: '../assets/icons/modulo-ppr-cinza.svg'
  }, {
    nome: 'modulo-ppr-laranja',
    url: '../assets/icons/modulo-ppr-laranja.svg'
  }, {
    nome: 'modulo-telefonia',
    url: '../assets/icons/modulo-telefonia.svg'
  }, {
    nome: 'modulo-telefonia-cinza',
    url: '../assets/icons/modulo-telefonia-cinza.svg'
  }, {
    nome: 'modulo-telefonia-laranja',
    url: '../assets/icons/modulo-telefonia-laranja.svg'
  }, {
    nome: 'modulo-webrado',
    url: '../assets/icons/modulo-webrado.svg'
  }, {
    nome: 'modulo-webrado-cinza',
    url: '../assets/icons/modulo-webrado-cinza.svg'
  }, {
    nome: 'modulo-webrado-laranja',
    url: '../assets/icons/modulo-webrado-laranja.svg'
  }, {
    nome: 'modulo-gears',
    url: '../assets/icons/modulo-gears.svg'
  }];

  constructor(private matIconRegistry: MatIconRegistry,
              private domSanitizer: DomSanitizer,
              private translateService: TranslateService,
              private permissionsService: NgxPermissionsService) {
    // registro de icones SVG utilizados no sistema
    this._registrarIcones();

    // Translate da aplicacao
    translateService.setDefaultLang('pt-br');
  }

  ngOnInit(): void {
    // Carrega as permissoes do sistema (caso esteja tenha token no localStorage)
    this._carregarPermissoes();
    this._guide();
  }

  private _registrarIcones() {
    this.svgIconsList.map(icone => {
      this.matIconRegistry.addSvgIcon(
        icone.nome,
        this.domSanitizer.bypassSecurityTrustResourceUrl(icone.url)
      );
    });
  }

  private _carregarPermissoes() {
    // @TODO carregar lista do localStorage caso tenha token valido
    const perm = ['ADMIN', 'EDITOR'];
    this.permissionsService.loadPermissions(perm);
  }

  private _guide(): void {
    const introConfig = {
      steps: [
        {
          title: 'Bem vindo',
          description: 'Para comerçar, vamos realizar seu login',
          selector: null,
          btnRightLabel: 'Vamos Lá!'
        },
        {
          title: 'Credenciais',
          description: 'Clique no painel para expandir o formulário',
          selector: '#login-panel'
        },
        {
          title: 'E-mail',
          description: 'Preencha com o e-mail utilizado no seu cadastro',
          selector: '#email-form'
        },
        {
          title: 'Senha',
          description: 'Preencha com a senha que você cadastrou',
          selector: '#senha-form'
        }
        ,
        {
          title: 'Pronto',
          description: 'Agora é só clicar em acessar para iniciar sua sessão',
          selector: '#login-btn',
          btnRightLabel: 'Show!'
        }
      ]
    };
    // const container = document.querySelector('#intro'),
    //   loginGuide = introGuide(container, introConfig);
    // loginGuide.start(); @TODO jogar no componente de login !
  }
}
