import { Injectable } from '@angular/core';
import { BrdHttpGestaoAcessoAbstract } from '../../shared/util/http/brd-http-gestao-acesso.abstract';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ParametrosInatividade } from '../domains/parametros-inatividade';
import { ParametrosConfigEmail } from '../domains/parametros-config-email';

@Injectable({
  providedIn: 'root'
})
export class ParametrizacoesService extends BrdHttpGestaoAcessoAbstract {
  private static URL_PARAMETRIZACOES = `parametrization`;

  constructor(protected http: HttpClient) {
    super(http);
  }

  recuperarInatividade(): Observable<ParametrosInatividade> {
    const url = `${this._getUrlBase()}${ParametrizacoesService.URL_PARAMETRIZACOES}/inactivity-time`;
    return this
      ._http
      .get<ParametrosInatividade>(url);
  }

  salvarInatividade(parametrosSalvar: ParametrosInatividade): Observable<any> {
    const url = `${this._getUrlBase()}${ParametrizacoesService.URL_PARAMETRIZACOES}/inactivity-time`;
    return this
      ._http
      .post<any>(url, parametrosSalvar);
  }

  recuperarEmailConfig(): Observable<ParametrosConfigEmail> {
    const url = `${this._getUrlBase()}${ParametrizacoesService.URL_PARAMETRIZACOES}/email-server`;
    return this
      ._http
      .get<ParametrosConfigEmail>(url);
  }

  salvarEmailConfig(parametrosSalvar: ParametrosConfigEmail): Observable<any> {
    const url = `${this._getUrlBase()}${ParametrizacoesService.URL_PARAMETRIZACOES}/email-server`;
    return this
      ._http
      .post<any>(url, parametrosSalvar);
  }
}
