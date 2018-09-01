import { Pipe, PipeTransform } from '@angular/core';
import { RegexConstantes } from '../util/regex-constantes';

@Pipe({
  name: 'cpfCnpj'
})
export class CpfCnpjPipe implements PipeTransform {

  transform(value: string, args?: any): string {
    if (!value) {
      return value;
    }

    // CPF 11 caracteres
    if (value.length === 11) {
      return value.replace(RegexConstantes.REGEX_CPF, '$1.$2.$3-$4');
    }

    // CPNJ 14 caracteres
    return value.replace(RegexConstantes.REGEX_CNPJ, '$1.$2.$3/$4-$5');
  }

}
