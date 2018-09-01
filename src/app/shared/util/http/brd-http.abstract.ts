import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

export abstract class BrdHttpAbstract {

  URL_BASE: string = environment.apiUrl;

  protected constructor(protected _http: HttpClient) {
  }

  protected abstract _getUrlBase(): string;

}
