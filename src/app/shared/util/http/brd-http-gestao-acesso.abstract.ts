import { BrdHttpAbstract } from './brd-http.abstract';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

export abstract class BrdHttpGestaoAcessoAbstract extends BrdHttpAbstract {

  URL_GESAO_ACESSO: string = environment.urlGesaoAcesso;

  protected constructor(protected http: HttpClient) {
    super(http);
  }

  protected _getUrlBase(): string {
    return `${this.URL_BASE}${this.URL_GESAO_ACESSO}`;
  }
}
