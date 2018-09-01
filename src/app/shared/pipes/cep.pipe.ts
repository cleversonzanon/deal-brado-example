import { Pipe, PipeTransform } from '@angular/core';
import { RegexConstantes } from '../util/regex-constantes';

@Pipe({
  name: 'cep'
})
export class CepPipe implements PipeTransform {

  transform(value: string, args?: any): string {
    if (!value) {
      return value;
    }

    if (value.length === 8) {
      return value.replace(RegexConstantes.REGEX_CEP, '$1-$2');
    }
    return value;
  }

}
