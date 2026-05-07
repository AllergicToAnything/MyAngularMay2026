import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'convert',
})
export class ConvertPipe implements PipeTransform {
  transform(value: any, args: any): unknown {
    if (args == 'upperCase') {
      return String(value).toUpperCase();
    }
    if (args == 'kgToGram') {
      return value * 1000;
    }

    return;
  }
}
