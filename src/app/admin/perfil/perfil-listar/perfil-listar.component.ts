import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ModalCrudComponent } from '../../template/modal-crud/modal-crud.component';
import { MatDialogRef } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { PerfilService } from '../perfil.service';
import { Pagination } from '../../../domains/pagination';
import { PerfilListaAcesso } from '../../domains/perfil-lista-acesso';
import { PerfilFiltrosAtivos } from '../../domains/perfil-filtros-ativos';
import { ModalClose } from '../../template/modal-close';
import { NavigationExtras } from '@angular/router/src/router';
import { TipoAcao } from '../perfil-modal-inicial/perfil-modal-inicial.component';
import { ErroValidator } from '../../template/erro-validator';

@Component({
  selector: 'app-perfil-listar',
  templateUrl: './perfil-listar.component.html',
  styleUrls: ['./perfil-listar.component.scss']
})
export class PerfilListarComponent extends ModalClose implements OnInit {
  @ViewChild('scrollTable') _scrollTable: ElementRef;
  filtrosAtivos: PerfilFiltrosAtivos;
  loading = true;
  listaPaginada: Pagination<PerfilListaAcesso>;
  colunasDaTabela: string[] = ['ativo', 'perfil', 'modulos', 'actions-editar', 'actions-status'];

  constructor(protected dialogRef: MatDialogRef<ModalCrudComponent>,
              private _activatedRoute: ActivatedRoute,
              private _perfilService: PerfilService,
              private _router: Router) {
    super(dialogRef);
  }

  ngOnInit(): void {
    /* Pega na url os filtros informados (em base64) */
    const filtroStr = window.atob(this._activatedRoute.snapshot.queryParams.filtros);
    /* Convert string de filtros para objeto salvo no scopo */
    this.filtrosAtivos = <PerfilFiltrosAtivos>JSON.parse(filtroStr);
    /* Metodo para validar os filtros ativos */
    this._validaFiltrosAtivos();
    /* Chama metodo para recuperar os perfis cadastrados no sistema */
    this._recuperarPerfis();
  }

  totalFiltrosAtivos(): number {
    /* Inicia soma dos filtros ativos pelo total de modulos selecionados */
    let total = this.filtrosAtivos.modulos ? this.filtrosAtivos.modulos.length : 0;
    /* Soma se tem filtro por nome */
    if (this.filtrosAtivos.nome != null) {
      total += 1;
    }
    /* Soma se tem filtro por status */
    if (this.filtrosAtivos.ativo != null) {
      total += 1;
    }
    /* Retorna total de filtros aplicados */
    return total;
  }

  onTableScroll(event: any) {
    /* Valida se as informacoes na tela ja estão na ultima pagina */
    if (!this.listaPaginada.last) {
      /* -- Calc para pegar total faltante da lista (paginacao) -- */
      const tableViewHeight = event.target.offsetHeight; // viewport: ~560px
      const tableScrollHeight = event.target.scrollHeight; // length of all table
      const scrollLocation = event.target.scrollTop; // how far user scrolled
      const buffer = 200;
      const limit = tableScrollHeight - tableViewHeight - buffer;
      /* -- end Calc -- */

      if (scrollLocation > limit) {
        /* Aumenta o numero da pagina para enviar para o metodo de busca */
        this.listaPaginada.number += 1;
        /* Seta flag de last apenas para não entrar diversas vezes no if do scroll da tela */
        this.listaPaginada.last = true;
        /* Chama metodo para retornar elementos passando a pagina a ser recuperada */
        this._recuperarPerfis(this.listaPaginada.number);
      }
    }
  }

  onClickVoltar(): void {
    /* Navega até a tela anterior a qual tem as opcoes de novo e busca perfil */
    this._router.navigate(
      [{ outlets: { modal: 'modal-perfil-inicial' } }],
      { queryParams: { tipoAcao: TipoAcao.EDITAR_PERFIL } }
    );
  }

  onClickRemoverFiltro(field: string): void {
    /* Remove filtro de acordo com o field passado (nome ou ativo)*/
    this.filtrosAtivos[field] = null;
    /* Metodo para remover filtro e realizar a busca novamente */
    this._removeFiltro();
  }

  onClickRemoverFiltroModulo(indexModulo: number): void {
    /* Remove modulo da lista com base no index informado */
    this.filtrosAtivos.modulos.splice(indexModulo, 1);
    /* Metodo para remover filtro e realizar a busca novamente */
    this._removeFiltro();
  }

  onClickResetarFiltros(): void {
    /* Remove todos os filtros da tela*/
    this.filtrosAtivos = null;
    /* Metodo para remover filtro e realizar a busca novamente */
    this._removeFiltro();
  }

  onClickEditar(perfil: PerfilListaAcesso): void {
    // Parametros para passar na rota
    const routerExtras = <NavigationExtras>{
      queryParams: {
        perfil: perfil.id,
        name: perfil.name
      }
    };
    /* Abre modal com os parametros */
    this._router.navigate(
      [{ outlets: { modal: 'perfil-escolher-modulos' } }],
      routerExtras
    );
  }

  onClickAlterarStatus(perfil: PerfilListaAcesso): void {
    /* Query para passar para a modal de ativacao/inativacao */
    const routerExtras = <NavigationExtras>{
      queryParams: {
        'perfil-name': perfil.name,
        'perfil-id': perfil.id
      },
      queryParamsHandling: 'merge',
    };
    /* Modal default (ativacao)*/
    let modal = 'perfil-confirmar-ativacao';
    /* Veririca o status atual do perfil (Inativacao)*/
    if (perfil.active) {
      modal = 'perfil-confirmar-inativacao';
    }
    /* Abre modal com os parametros */
    this._router.navigate(
      [{ outlets: { modal: modal } }],
      routerExtras
    );
  }

  private _removeFiltro(): void {
    /* Metodo para validar se tem filtros ativos ainda (comportamento visual) */
    this._validaFiltrosAtivos();
    /* Retornar SCROLL da lista para o topo */
    this._scrollTable.nativeElement.scrollTop = 0;
    /* Busca novamente os pefis com base na lista de filtros */
    this._recuperarPerfis();
  }

  private _recuperarPerfis(page: number = 0) {
    /* Inicia loading da tela */
    this.loading = true;
    /* Chamada do servico HTTP para recuperar os perfis */
    this._perfilService
      .listar(this.filtrosAtivos, page)
      .subscribe(listaPaginada => {
        /* Controle da pagina atual (controlada pelo Scrool) */
        if (page !== 0) {
          /* Pagina recebida do backend */
          this.listaPaginada.number = listaPaginada.number;
          /* Flag para saber se é a ultima pagina */
          this.listaPaginada.last = listaPaginada.last;
          /* Concatena lista recebida com o conteudo ja existente */
          this.listaPaginada.content = this.listaPaginada.content.concat(listaPaginada.content);
        } else {
          /* Atribui a lista do tipo PAGE do spring ao objeto raiz */
          this.listaPaginada = listaPaginada;
        }
        /* Remove loading */
        this.loading = false;
      }, err => {
        /* Remove loading */
        this.loading = false;
        /* Valida qual tipo de erro ocorreu */
        ErroValidator.validaErroPerfil(err, this._router);
      });
  }

  private _validaFiltrosAtivos(): void {
    /* Valida se tem algum filtro */
    if (this.filtrosAtivos != null) {
      /* Valida se tem filtro de ativo/inativo */
      if (this.filtrosAtivos.ativo != null) {
        return;
      }
      /* Valida se tem filtro por nome */
      if (this.filtrosAtivos.nome != null) {
        return;
      }
      /* Valida se tem filtro por algum modulo */
      if (this.filtrosAtivos.modulos != null && this.filtrosAtivos.modulos.length > 0) {
        return;
      }
      this.filtrosAtivos = null;
    }
  }
}
