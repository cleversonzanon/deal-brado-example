import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ModalClose } from '../../template/modal-close';
import { MatDialogRef } from '@angular/material';
import { ModalCrudComponent } from '../../template/modal-crud/modal-crud.component';
import { ModalType } from '../../template/modal-header/modal-header.component';
import { TipoAcaoUsuario } from '../usuario-modal-inicial/usuario-modal-inicial.component';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuarioFiltrosAtivos } from '../../domains/usuario-filtros-ativos';
import { Pagination } from '../../../domains/pagination';
import { TipoUsuario } from '../../domains/enum/tipo-usuario';
import { UsuarioService } from '../usuario.service';
import { ErroValidator } from '../../template/erro-validator';
import { ListUsuarioDto } from '../../domains/list-usuario-dto';
import { UsuarioDto } from '../../domains/usuario-dto';
import { NavigationExtras } from '@angular/router/src/router';

@Component({
  selector: 'app-usuario-listar',
  templateUrl: './usuario-listar.component.html',
  styleUrls: ['./usuario-listar.component.scss']
})
export class UsuarioListarComponent extends ModalClose implements OnInit {
  @ViewChild('scrollTable') _scrollTable: ElementRef;
  ModalType = ModalType;
  TipoUsuario = TipoUsuario;
  loading = false;
  filtrosAtivos: UsuarioFiltrosAtivos;
  listaPaginada: Pagination<ListUsuarioDto>;
  colunasDaTabela: string[] = ['ativo', 'nome', 'perfil', 'empresa'];
  usuarioSelecionado: UsuarioDto;

  constructor(protected dialogRef: MatDialogRef<ModalCrudComponent>,
              private _activatedRoute: ActivatedRoute,
              private _router: Router,
              private _usuarioService: UsuarioService) {
    super(dialogRef);
  }

  ngOnInit(): void {
    /* Pega na url os filtros informados (em base64) */
    const filtroStr = window.atob(this._activatedRoute.snapshot.queryParams.filtros);
    /* Convert string de filtros para objeto salvo no scopo */
    this.filtrosAtivos = <UsuarioFiltrosAtivos>JSON.parse(filtroStr);
    /* Metodo para validar os filtros ativos */
    this._validaFiltrosAtivos();
    /* Chama metodo para recuperar os usuarios cadastrados no sistema */
    this._recuperarUsuarios();
  }

  totalFiltrosAtivos(): number {
    /* Inicia a soma dos filtros ativos pelo total de unidades de servico */
    let total = this.filtrosAtivos.unidadeDeServico ? this.filtrosAtivos.unidadeDeServico.length : 0;
    /* Soma de filtros do tipo usuario */
    total += this.filtrosAtivos.tipoUsuario ? this.filtrosAtivos.tipoUsuario.length : 0;
    /* Soma de filtros para terminais */
    total += this.filtrosAtivos.terminais ? this.filtrosAtivos.terminais.length : 0;
    /* Soma de filtros para perfil autorizacao */
    total += this.filtrosAtivos.perfilAutorizacao ? this.filtrosAtivos.perfilAutorizacao.length : 0;
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

  onClickVoltar(): void {
    /* Navega até a tela anterior a qual tem as opcoes de novo e busca usuario */
    this._router.navigate(
      [{ outlets: { modal: 'modal-usuario-inicial' } }],
      { queryParams: { tipoAcaoUsuario: TipoAcaoUsuario.EDITAR_USUARIO } }
    );
  }

  onClickSelecionarUsuario(listUsuarioDtoItem: ListUsuarioDto): void {
    /* Inicia loading da tela */
    this.loading = true;
    /* Servico de usuario (recuperar com base no id) */
    this._usuarioService
      .recuperarPreview(listUsuarioDtoItem.id)
      .subscribe(usuario => {
        /* Usuario selecionado recuperado do backend */
        this.usuarioSelecionado = usuario;

        /* Remove loading */
        this.loading = false;
      }, err => {
        /* Remove loading */
        this.loading = false;
        /* Valida qual tipo de erro ocorreu */
        ErroValidator.validaErroUsuario(err, this._router);
      });
  }

  onClickAlterarStatusUsuario(): void {
    /* Query para passar para a modal de ativacao/inativacao */
    const routerExtras = <NavigationExtras>{
      queryParams: {
        'usuarioId': this.usuarioSelecionado.id
      },
      queryParamsHandling: 'merge'
    };
    /* Modal default (ativacao)*/
    let modal = 'usuario-confirmar-ativacao';
    /* Veririca o status atual do usuario (Inativacao)*/
    if (this.usuarioSelecionado.active) {
      modal = 'usuario-confirmar-inativacao';
    }
    /* Abre modal com os parametros */
    this._router.navigate(
      [{ outlets: { modal: modal } }],
      routerExtras
    );
  }

  onClickEditarUsuario(): void {
    /* Abre modal com os parametros para o reset de senha */
    this._router.navigate(
      [{ outlets: { modal: 'usuario-editar' } }],
      {
        queryParams: {
          'usuarioId': this.usuarioSelecionado.id
        },
        queryParamsHandling: 'merge'
      }
    );
  }

  onClickResetarSenhaUsuario(): void {
    /* Abre modal com os parametros para o reset de senha */
    this._router.navigate(
      [{ outlets: { modal: 'usuario-confirmar-reset-senha' } }],
      {
        queryParams: {
          'usuarioId': this.usuarioSelecionado.id
        },
        queryParamsHandling: 'merge'
      }
    );
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
        this._recuperarUsuarios(this.listaPaginada.number);
      }
    }
  }

  onClickRemoverFiltro(field: string): void {
    /* Remove filtro de acordo com o field passado */
    this.filtrosAtivos[field] = null;
    /* Metodo para remover filtro e realizar a busca novamente */
    this._removeFiltro();
  }

  onClickResetarFiltros(): void {
    /* Remove todos os filtros da tela*/
    this.filtrosAtivos = null;
    /* Metodo para remover filtro e realizar a busca novamente */
    this._removeFiltro();
  }

  onClickRemoverFiltroDeLista(lista: string, index: number): void {
    /* Remove perfil da lista com base no index informado */
    this.filtrosAtivos[lista].splice(index, 1);
    /* Metodo para remover filtro e realizar a busca novamente */
    this._removeFiltro();
  }

  private _removeFiltro(): void {
    /* Metodo para validar se tem filtros ativos ainda (comportamento visual) */
    this._validaFiltrosAtivos();
    /* Retornar SCROLL da lista para o topo */
    this._scrollTable.nativeElement.scrollTop = 0;
    /* Busca novamente os usuarios com base na lista de filtros */
    this._recuperarUsuarios();
  }

  private _recuperarUsuarios(page: number = 0): void {
    /* Inicia loading da tela */
    this.loading = true;
    /* Chamada do servico HTTP para recuperar os usuarios */
    this._usuarioService
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

        console.log(listaPaginada);
        /* Remove loading */
        this.loading = false;
      }, err => {
        /* Remove loading */
        this.loading = false;
        /* Valida qual tipo de erro ocorreu */
        ErroValidator.validaErroUsuario(err, this._router);
      });
  }

  private _validaFiltrosAtivos(): void {
    /* Valida se tem algum filtro */
    if (this.filtrosAtivos != null) {
      /* Valida se tem algum filtro de ativo/inativo */
      if (this.filtrosAtivos.ativo) {
        return;
      }
      /* Valida se tem algum filtro por nome */
      if (this.filtrosAtivos.nome != null) {
        return;
      }
      /* Valida se tem algum filtro por perfil */
      if (this.filtrosAtivos.perfilAutorizacao != null && this.filtrosAtivos.perfilAutorizacao.length > 0) {
        return;
      }
      /* Valida se tem algum filtro por terminal */
      if (this.filtrosAtivos.terminais != null && this.filtrosAtivos.terminais.length > 0) {
        return;
      }
      /* Valida se tem algum filtro por tipoUsuario */
      if (this.filtrosAtivos.tipoUsuario != null && this.filtrosAtivos.tipoUsuario.length > 0) {
        return;
      }
      /* Valida se tem algum filtro por unidadeDeServico */
      if (this.filtrosAtivos.unidadeDeServico != null && this.filtrosAtivos.unidadeDeServico.length > 0) {
        return;
      }
      this.filtrosAtivos = null;
    }
  }
}
