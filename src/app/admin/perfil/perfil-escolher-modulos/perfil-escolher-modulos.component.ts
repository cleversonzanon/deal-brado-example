import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PerfilService } from '../perfil.service';
import { ModuloSelecionar } from '../../domains/modulo-selecionar';
import { MatDialogRef } from '@angular/material';
import { ModalCrudComponent } from '../../template/modal-crud/modal-crud.component';
import { ModalClose } from '../../template/modal-close';
import { Modulo } from '../../domains/modulo';
import { TipoAcao } from '../perfil-modal-inicial/perfil-modal-inicial.component';
import { ErroValidator } from '../../template/erro-validator';
import { ModuloService } from '../modulo.service';

@Component({
  selector: 'app-perfil-escolher-modulos',
  templateUrl: './perfil-escolher-modulos.component.html',
  styleUrls: ['./perfil-escolher-modulos.component.scss']
})
export class PerfilEscolherModulosComponent extends ModalClose implements OnInit {
  loading = true;
  moduloList: ModuloSelecionar[] = [];
  perfilId: number;

  constructor(protected dialogRef: MatDialogRef<ModalCrudComponent>,
              private _activatedRoute: ActivatedRoute,
              private _moduloService: ModuloService,
              private _perfilService: PerfilService,
              private _router: Router) {
    super(dialogRef);
  }

  ngOnInit(): void {
    /* Recupera o id do perfil em caso de edição */
    this.perfilId = this._activatedRoute.snapshot.queryParams.perfil;
    /* Recupera todos os modulos */
    this._recuperarModulos();
  }

  /**
   * @desc
   *  Metodo de onClick para avancar para tela de funcionalidades
   *
   */
  onClickAvancar(): void {
    /* Lista de modulos selecionados */
    const modulosId = this.moduloList
      .filter(mod => mod.selecionado)
      .map(mod => mod.id);

    /* Redireciona para a tela de seleção das funcionalidades */
    this._router.navigate(
      [{ outlets: { modal: 'perfil-funcionalidades' } }],
      {
        queryParamsHandling: 'merge',
        queryParams: {
          modules: modulosId
        }
      }
    );
  }

  /**
   * @desc
   *  Metodo para voltar para tela anterior
   *
   */
  onClickVoltar(): void {
    /* Navega até a tela anterior a qual tem as opcoes de novo e busca perfil */
    if (this.perfilId) {
      /* Retorna para busca de perfil (PODE SER NECESSARIO VOLTAR PARA LISTAGEM filtrada!) */
      this._router.navigate(
        [{ outlets: { modal: 'modal-perfil-inicial' } }],
        { queryParams: { tipoAcao: TipoAcao.EDITAR_PERFIL } }
      );
    } else {
      /* Volta para tela inicial de criacao de perfil */
      this._router.navigate(
        [{ outlets: { modal: 'modal-perfil-inicial' } }],
        { queryParams: { tipoAcao: TipoAcao.CRIAR_PERFIL } }
      );
    }
  }

  /**
   * @desc
   *  Metodo que retorna se tem algum modulo selecioado.
   *
   * @returns {boolean}
   */
  temModuloSelecionado(): boolean {
    return this.moduloList.some(mod => mod.selecionado);
  }

  /**
   * @desc
   *  Metodo para recuperar os modulos selecionados caso tenha um perfil informado (edicao)
   *
   * @private
   */
  private _loadPerfilModulos(): void {
    if (this.perfilId) {
      // Recupera os modulos por perfil
      this._perfilService
        .listarModulosByPerfilId(this.perfilId)
        .subscribe(perfil => {
          // Muda a flag selecionado pra true para todos os modulos que o perfil já possui
          perfil.forEach(modulo => {
            this.moduloList.forEach(modSelec => {
              if (modulo.id === modSelec.id) {
                modSelec.selecionado = true;
              }
            });
          });
          this.loading = false;
        }, err => {
          this.loading = false;

          /* Valida qual tipo de erro ocorreu */
          ErroValidator.validaErroPerfil(err, this._router);
        });
    } else {
      this.loading = false;
    }
  }

  /**
   * @desc
   *  Metodo para recuperar a lista de modulos (lista atual vem sem nenhuma informacao de icone)
   *
   * @private
   */
  private _recuperarModulos(): void {
    this._moduloService
      .listarModulos()
      .subscribe(modulos => {
        /* Modifica objeto de resposta para dicionar icones */
        this.moduloList = this._setIconesModulos(modulos);
        /* Carrega os modulos de um perfil sendo editado; */
        this._loadPerfilModulos();
      }, err => {
        this.loading = false;
        /* Valida qual tipo de erro ocorreu */
        ErroValidator.validaErroPerfil(err, this._router);
      });
  }

  /**
   * @desc
   *  Metodo para fazer um de/para dos modulos atribuindo um icone ao modulo.
   *
   * @param {Modulo[]} modulos
   * @returns {ModuloSelecionar[]}
   * @private
   */
  private _setIconesModulos(modulos: Modulo[]): ModuloSelecionar[] {
    return modulos.map(modulo => {
      const newModulo = <ModuloSelecionar>modulo;
      switch (newModulo.name.toLowerCase()) {
        case 'administração': {
          newModulo.icone = 'modulo-adm';
          break;
        }
        case 'ppr': {
          newModulo.icone = 'modulo-ppr';
          break;
        }
        case 'portal do cliente': {
          newModulo.icone = 'modulo-webrado';
          break;
        }
        case 'telefonia': {
          newModulo.icone = 'modulo-telefonia';
          break;
        }
      }
      return newModulo;
    });
  }
}
