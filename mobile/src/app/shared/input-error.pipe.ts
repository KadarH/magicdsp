import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'inputError',
})
export class InputErrorPipe implements PipeTransform {
  transform(value: any): string {
    let rvalue = '';

    if (value !== null) {
      if (value.required) {
        rvalue = 'Ce champ est obligatoire.';
      }
    }
    return rvalue;
  }
}
