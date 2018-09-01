import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'initials'
})
export class InitialsPipe implements PipeTransform {

  transform(value: string, args?: any): string {
    if (!value) {
      return value;
    }
    const words = value.split(' ');
    let newValue = words[0][0];
    if (words.length >= 2) {
      newValue += words[words.length - 1][0];
    }
    return newValue.toUpperCase();
  }

}
