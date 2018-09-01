import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EmpresaSuggest } from '../domains/empresa-suggest';
import { Usuario } from '../domains/usuario';
import { Router } from '@angular/router';
import { TipoAcaoUsuario } from './usuario-modal-inicial/usuario-modal-inicial.component';
import { BrdHttpGestaoAcessoAbstract } from '../../shared/util/http/brd-http-gestao-acesso.abstract';
import { Pagination } from '../../domains/pagination';
import { UsuarioFiltrosAtivos } from '../domains/usuario-filtros-ativos';
import { ListUsuarioDto } from '../domains/list-usuario-dto';
import { UsuarioDto } from '../domains/usuario-dto';

import { saveAs } from 'file-saver/FileSaver';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService extends BrdHttpGestaoAcessoAbstract {
  private static URL_USUARIO = `user`;
  private static URL_TRANSPORTADORA = `carrier`;
  private static URL_GRUPO_CLIENTE = `client-group`;
  private static URL_ARMADOR = `shipowner`;

  private XLSX_CONTENT_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

  constructor(http: HttpClient,
              private _router: Router) {
    super(http);
  }

  aceitarTermo(email: string): Observable<any> {
    const url = `${this._getUrlBase()}${UsuarioService.URL_USUARIO}/accept-term`;
    return this._http.post(url, {
      email
    });
  }

  listarTransportadoras(): Observable<EmpresaSuggest[]> {
    const url = `${this._getUrlBase()}${UsuarioService.URL_TRANSPORTADORA}`;
    return this._http
      .get<EmpresaSuggest[]>(url);
  }

  listarGrupoDeClientes(): Observable<EmpresaSuggest[]> {
    const url = `${this._getUrlBase()}${UsuarioService.URL_GRUPO_CLIENTE}`;
    return this._http
      .get<EmpresaSuggest[]>(url);
  }

  listarArmadores(): Observable<EmpresaSuggest[]> {
    const url = `${this._getUrlBase()}${UsuarioService.URL_ARMADOR}`;
    return this._http
      .get<EmpresaSuggest[]>(url);
  }

  salvar(usuario: Usuario) {
    const url = `${this._getUrlBase()}${UsuarioService.URL_USUARIO}`;
    if (usuario.id) { // Editar
      return this._http
        .put(url, usuario)
        .pipe(
          map(resp => {
            this._router.navigate(
              [{ outlets: { modal: 'modal-usuario-inicial' } }],
              {
                queryParams: {
                  tipoAcaoUsuario: TipoAcaoUsuario.USUARIO_EDITADO_COM_SUCESSO,
                  nomeUsuario: usuario.name
                }
              }
            );
            return resp;
          })
        );
    }
    return this._http // novo usuario
      .post(url, usuario)
      .pipe(
        map(resp => {
          this._router.navigate(
            [{ outlets: { modal: 'modal-usuario-inicial' } }],
            {
              queryParams: {
                tipoAcaoUsuario: TipoAcaoUsuario.USUARIO_CRIADO_COM_SUCESSO,
                nomeUsuario: usuario.name
              }
            }
          );
          return resp;
        })
      );
  }

  filtrarUsuarios(value: string): Observable<string[]> {
    const url = `${this._getUrlBase()}${UsuarioService.URL_USUARIO}/${value}`;
    return this._http.get<string[]>(url);
  }

  listar(filtrosAtivos: UsuarioFiltrosAtivos, page: number): Observable<Pagination<ListUsuarioDto>> {
    /* URL para busca de usuarios */
    const url = `${this._getUrlBase()}${UsuarioService.URL_USUARIO}`;
    /* Construcao das parametros e adicionada pagina a ser recuperada (paginacao) */
    let params = new HttpParams().set('page', `${page}`);

    /* Nao tem nennhum filtro aplicado */
    if (filtrosAtivos != null) {
      /* Parametro de status */
      if (filtrosAtivos.ativo != null) {
        params = params.append('status', `${filtrosAtivos.ativo}`);
      }
      /* Filtro por nome */
      if (filtrosAtivos.nome != null) {
        params = params.append('name', filtrosAtivos.nome);
      }
      /* Filtro de perfil */
      if (filtrosAtivos.perfilAutorizacao != null && filtrosAtivos.perfilAutorizacao.length > 0) {
        filtrosAtivos.perfilAutorizacao.map(perfil => {
          params = params.append('profile', `${perfil.id}`);
        });
      }
      /* Filtro de terminais */
      if (filtrosAtivos.terminais != null && filtrosAtivos.terminais.length > 0) {
        filtrosAtivos.terminais.map(terminal => {
          params = params.append('terminal', `${terminal.id}`);
        });
      }
      /* Filtro de Unidade de Servico */
      if (filtrosAtivos.unidadeDeServico != null && filtrosAtivos.unidadeDeServico.length > 0) {
        filtrosAtivos.unidadeDeServico.map(unidadeServico => {
          params = params.append('serviceUnit', `${unidadeServico.id}`);
        });
      }
      /* Filtro de tipo de usuário */
      if (filtrosAtivos.tipoUsuario != null && filtrosAtivos.tipoUsuario.length > 0) {
        filtrosAtivos.tipoUsuario.map(tipo => {
          params = params.append('type', `${tipo}`);
        });
      }
    }
    /* Request http com parametros */
    return this._http
      .get<Pagination<ListUsuarioDto>>(url, { params });
  }

  recuperarPorId(idUsuario: number): Observable<any> {
    const url = `${this._getUrlBase()}${UsuarioService.URL_USUARIO}/${idUsuario}/details`;
    return this._http.get<UsuarioDto>(url);
  }

  recuperarPreview(idUsuario: number): Observable<UsuarioDto> {
    const url = `${this._getUrlBase()}${UsuarioService.URL_USUARIO}/${idUsuario}/preview`;
    return this._http.get<UsuarioDto>(url);
  }

  inativar(id: number): Observable<any> {
    const url = `${this._getUrlBase()}${UsuarioService.URL_USUARIO}/${id}`;
    return this._http
      .delete(url);
  }

  ativar(id: number): Observable<any> {
    const url = `${this._getUrlBase()}${UsuarioService.URL_USUARIO}/${id}/activate`;
    return this._http
      .put(url, null);
  }

  resetDeSenha(id: number): Observable<any> {
    const url = `${this._getUrlBase()}${UsuarioService.URL_USUARIO}/${id}/password`;
    return this._http
      .put(url, null);
  }

  downloadExport(): Observable<any> {
    const url = `${this._getUrlBase()}${UsuarioService.URL_USUARIO}/export`;
    return this._http.get(url, { responseType: 'arraybuffer' }).pipe(
      map(response => this._downloadFile(response))
    );
  }

  private _downloadFile(data: any): void {
    const byteArray = new Uint8Array(data),
      blob = new Blob([byteArray], { type: this.XLSX_CONTENT_TYPE });
    saveAs(blob, 'user-export.xlsx');
  }
}
