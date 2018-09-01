import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NomeValidator } from '../domains/nome-validator';
import { Pagination } from '../../domains/pagination';
import { PerfilListaAcesso } from '../domains/perfil-lista-acesso';
import { PerfilFiltrosAtivos } from '../domains/perfil-filtros-ativos';
import { Modulo } from '../domains/modulo';
import { Autorizacao } from '../domains/autorizacao';
import { ProfileDto } from '../domains/profile-dto';
import { PerfilSuggest } from '../domains/perfil-suggest';
import { BrdHttpGestaoAcessoAbstract } from '../../shared/util/http/brd-http-gestao-acesso.abstract';

@Injectable({
  providedIn: 'root'
})
export class PerfilService extends BrdHttpGestaoAcessoAbstract {

  private static URL_PERFIL = `profile`;

  constructor(protected http: HttpClient) {
    super(http);
  }

  suggest(): Observable<PerfilSuggest[]> {
    const url = `${this._getUrlBase()}${PerfilService.URL_PERFIL}`;
    return this._http
      .get<PerfilSuggest[]>(url);
  }

  validarNome(nomeValidator: NomeValidator): Observable<any> {
    const url = `${this._getUrlBase()}${PerfilService.URL_PERFIL}/name/validate`;
    return this._http
      .post<any>(url, nomeValidator);
  }

  listar(filtrosAtivos: PerfilFiltrosAtivos, page: number): Observable<Pagination<PerfilListaAcesso>> {
    /* URL para busca de perfil */
    const url = `${this._getUrlBase()}${PerfilService.URL_PERFIL}/filter`;
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
      /* Filtro de modulos */
      if (filtrosAtivos.modulos != null && filtrosAtivos.modulos.length > 0) {
        filtrosAtivos.modulos.map(mod => {
          params = params.append('module', `${mod.id}`);
        });
      }
    }
    return this._http
      .get<Pagination<PerfilListaAcesso>>(url, { params });
  }

  filtrarPerfis(value: string): Observable<string[]> {
    const url = `${this._getUrlBase()}${PerfilService.URL_PERFIL}/${value}`;
    return this._http.get<string[]>(url);
  }

  inativar(id: string): Observable<any> {
    const url = `${this._getUrlBase()}${PerfilService.URL_PERFIL}/${id}`;
    return this._http
      .delete(url);
  }

  ativar(id: string): Observable<any> {
    const url = `${this._getUrlBase()}${PerfilService.URL_PERFIL}/${id}/activate`;
    return this._http
      .put(url, null);
  }

  listarModulosByPerfilId(id: number): Observable<Modulo[]> {
    const url = `${this._getUrlBase()}${PerfilService.URL_PERFIL}/${id}/modules`;
    return this._http.get<Modulo[]>(url);
  }

  listarAutorizacoesByPerfilId(id: string): Observable<Autorizacao[]> {
    const url = `${this._getUrlBase()}${PerfilService.URL_PERFIL}/${id}/authorizations`;
    return this._http.get<Autorizacao[]>(url);
  }

  salvar(profileParaSalvar: ProfileDto): Observable<any> {
    const url = `${this._getUrlBase()}${PerfilService.URL_PERFIL}`;

    if (profileParaSalvar.id) { // EDITAR
      this._http
        .put(url, profileParaSalvar);
    }

    // NOVO CADASTRO
    return this._http
      .post(url, profileParaSalvar);
  }
}
