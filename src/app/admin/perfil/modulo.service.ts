import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ModuloFuncionalidade } from '../domains/modulo-funcionalidade';
import { Observable } from 'rxjs';
import { Modulo } from '../domains/modulo';
import { BrdHttpGestaoAcessoAbstract } from '../../shared/util/http/brd-http-gestao-acesso.abstract';

@Injectable({
  providedIn: 'root'
})
export class ModuloService extends BrdHttpGestaoAcessoAbstract {
  private static URL_MODULO = `module`;

  constructor(protected http: HttpClient) {
    super(http);
  }

  listarModulos(): Observable<Modulo[]> {
    const url = `${this._getUrlBase()}${ModuloService.URL_MODULO}`;
    return this._http.get<Modulo[]>(url);
  }

  listarAutorizacoesPorModulo(modulos: string[]): Observable<ModuloFuncionalidade[]> {
    /* URL para listar funcionalidades */
    const url = `${this._getUrlBase()}${ModuloService.URL_MODULO}/authorizations`;
    /* Pametros de busca */
    let params = new HttpParams();
    /* Lista de modulos a buscar */
    modulos.map(mod => params = params.append('module', `${mod}`));
    return this._http
      .get<ModuloFuncionalidade[]>(url, { params });
  }
}
