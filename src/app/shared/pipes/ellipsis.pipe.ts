import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ellipsis'
})
export class EllipsisPipe implements PipeTransform {

  transform(value: string, length: number): string {
    /* Valida se é um valor */
    if (!value) {
      return value;
    }

    /* Retorna o valor normal */
    if (value.length < length) {
      return value;
    }

    return `${value.substr(0, length)}...`;
  }

}
