import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Terminal } from '../domains/terminal';
import { BrdHttpGestaoAcessoAbstract } from '../../shared/util/http/brd-http-gestao-acesso.abstract';

@Injectable({
  providedIn: 'root'
})
export class TerminalService extends BrdHttpGestaoAcessoAbstract {
  private static URL_TERMINAL = `terminal`;

  constructor(http: HttpClient) {
    super(http);
  }

  listar(): Observable<Terminal[]> {
    const url = `${this._getUrlBase()}${TerminalService.URL_TERMINAL}`;
    return this._http
      .get<Terminal[]>(url);
  }
}
