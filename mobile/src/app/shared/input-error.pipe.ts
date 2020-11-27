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
      if (value.email) {
        rvalue = 'Veuillez saisir une adresse mail valide';
      }

      if (value.minlength) {
        console.log(value);
        rvalue =
          'Ce champ doit comporter au minimum ' +
          value.requiredLength +
          ' caratères.';
      }
    }
    return rvalue;
  }
}
