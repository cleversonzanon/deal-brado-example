import { Component, OnInit } from '@angular/core';
import { ModalClose } from '../../template/modal-close';
import { MatDialogRef } from '@angular/material';
import { ModalCrudComponent } from '../../template/modal-crud/modal-crud.component';
import { ModuloFuncionalidade } from '../../domains/modulo-funcionalidade';
import { ActivatedRoute, Router } from '@angular/router';
import { ErroValidator } from '../../template/erro-validator';
import { ModuloService } from '../modulo.service';
import { Autorizacao } from '../../domains/autorizacao';
import { PerfilService } from '../perfil.service';
import { FormControl } from '@angular/forms';
import { ProfileDto } from '../../domains/profile-dto';

@Component({
  selector: 'app-perfil-funcionalidades',
  templateUrl: './perfil-funcionalidades.component.html',
  styleUrls: ['./perfil-funcionalidades.component.scss']
})
export class PerfilFuncionalidadesComponent extends ModalClose implements OnInit {
  loading = true;
  moduloFuncionalidade: ModuloFuncionalidade[];
  selected = new FormControl(0);
  perfilId: string;
  perfilName: string;

  constructor(protected dialogRef: MatDialogRef<ModalCrudComponent>,
              private _router: Router,
              private _activatedRoute: ActivatedRoute,
              private _moduloService: ModuloService,
              private _perfilService: PerfilService) {
    super(dialogRef);
  }

  ngOnInit(): void {
    this.perfilId = this._activatedRoute.snapshot.queryParams.perfil;
    this.perfilName = this._activatedRoute.snapshot.queryParams.name;
    const modulos = this._activatedRoute.snapshot.queryParams.modules;
    this._recuperarFuncionalidadesPorModulo(modulos);
  }

  onClickVoltar(): void {
    this._router.navigate(
      [{ outlets: { modal: 'perfil-escolher-modulos' } }],
      { preserveQueryParams: true }
    );
  }

  onClickAvancar(): void {
    this.loading = true;

    const list = this._reduceAutorizacaoList(this.moduloFuncionalidade)
      .filter((auth: Autorizacao) => auth.activate)
      .map((auth: Autorizacao) => auth.id);

    const profileParaSalvar = <ProfileDto> {
      id: this.perfilId,
      authorizationIdList: list,
      name: this.perfilName,
    };

    console.log(profileParaSalvar);

    this._perfilService
      .salvar(profileParaSalvar)
      .subscribe(resp => {
        console.log(resp);

        this.loading = false;
      }, err => {
        /* Cancela o loading da tela */
        this.loading = false;
        /* Valida qual tipo de erro ocorreu */
        ErroValidator.validaErroPerfil(err, this._router);
      });
  }

  _reduceAutorizacaoList(moduloFuncionalidade: ModuloFuncionalidade[], apenasConsulta = false): Autorizacao[] {
    /* Reducer até o primeiro nivel de autorizacao */
    let list = moduloFuncionalidade
      .reduce((acc, val) => acc.concat(val.functionalityDTOList), [])
      .reduce((acc, val) => acc.concat(val.authorizationList), []);

    /* Caso nao for do tipo apenas consulta retorna listagem com todas as autorizacoes de segundo nivel */
    if (!apenasConsulta) {
      list = list.reduce((acc, val) => acc.concat(val).concat(val.authorizationChildrenList), []);
    }
    return list;
  }

  onClickConsultar(event: Event): void {
    /* Stop da propagação do evento do href */
    event.preventDefault();
    /* Marca todos os elementos do tipo consulta (primeiro nivel) da tab aberta */
    this._reduceAutorizacaoList(
      [].concat(this.moduloFuncionalidade[this.selected.value]),
      true
    ).map((auth: Autorizacao) => auth.activate = true);
  }

  onClickMarcarTudo(event: Event): void {
    /* Stop da propagação do evento do href */
    event.preventDefault();
    /* marca todos os elementos da tab aberta */
    this._reduceAutorizacaoList([].concat(this.moduloFuncionalidade[this.selected.value]))
      .map((auth: Autorizacao) => auth.activate = true);
  }

  onClickDesmarcarTudo(event: Event): void {
    /* Stop da propagação do evento do href */
    event.preventDefault();
    /* Desmarca todos os elementos da tab aberta */
    this._reduceAutorizacaoList([].concat(this.moduloFuncionalidade[this.selected.value]))
      .map((auth: Autorizacao) => auth.activate = false);
  }

  private _recuperarFuncionalidadesPorModulo(modulos: string[]) {
    this._moduloService
      .listarAutorizacoesPorModulo(modulos)
      .subscribe(moduloFuncionalidade => {
        /* Seta a lista de funcionalidades */
        this.moduloFuncionalidade = moduloFuncionalidade;
        /* Recupera as informacoes do perfil do usuario */
        this._recuperarPerfil();
      }, err => {
        /* Cancela o loading da tela */
        this.loading = false;
        /* Valida qual tipo de erro ocorreu */
        ErroValidator.validaErroPerfil(err, this._router);
      });
  }

  private _recuperarPerfil() {
    /* Tem um perfil id na url (edicao) */
    if (this.perfilId) { // Edicao de um determinado perfil
      this._perfilService
        .listarAutorizacoesByPerfilId(this.perfilId)
        .subscribe(autorizacoes => {
          /* Valida quais autorizacoes ja estao marcadas no perfil */
          this._validaAutorizacoesStatus(autorizacoes);
          /* Cancela o loading da tela */
          this.loading = false;
        }, err => {
          /* Cancela o loading da tela */
          this.loading = false;
          /* Valida qual tipo de erro ocorreu */
          ErroValidator.validaErroPerfil(err, this._router);
        });
    } else { // Novo cadastro
      /* Cancela o loading da tela */
      this.loading = false;
    }
  }

  private _validaAutorizacoesStatus(autorizacoes: Autorizacao[]) {
    /* Lista de ids para ser comparado no filtro */
    const ids = autorizacoes.map(auth => auth.id);
    /* Filtro para procurar os objetos relacionados */
    this._reduceAutorizacaoList(this.moduloFuncionalidade)
      .filter((auth: Autorizacao) => {
        if (ids.includes(auth.id)) {
          return auth;
        }
      }).map(item => item.activate = true);
  }
}
