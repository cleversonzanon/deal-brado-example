import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UnidadeServico } from '../domains/unidade-servico';
import { BrdHttpGestaoAcessoAbstract } from '../../shared/util/http/brd-http-gestao-acesso.abstract';

@Injectable({
  providedIn: 'root'
})
export class UnidadeServicoService extends BrdHttpGestaoAcessoAbstract {
  private static URL_UNIDADE_SERVICO = `service-unit`;

  constructor(http: HttpClient) {
    super(http);
  }

  listar(): Observable<UnidadeServico[]> {
    const url = `${this._getUrlBase()}${UnidadeServicoService.URL_UNIDADE_SERVICO}`;
    return this._http
      .get<UnidadeServico[]>(url);
  }
}
