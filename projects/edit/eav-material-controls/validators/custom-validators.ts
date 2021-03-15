import { FormControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { ObjectModel } from '../../../ng-dialogs/src/app/shared/models/dictionary.model';
import { UrlHelpers } from '../../shared/helpers';
import { AdamControl } from '../input-types/hyperlink/hyperlink-library/hyperlink-library.models';

export class CustomValidators {

  /** Validate url chars */
  static onlySimpleUrlChars(allowPath: boolean, trimEnd: boolean): ValidationErrors {
    return (control: FormControl): ObjectModel<boolean> => {
      const cleanInputValue = UrlHelpers.stripNonUrlCharacters(control.value, allowPath, trimEnd);
      return (cleanInputValue === control.value) ? null : { onlySimpleUrlChars: true };
    };
  }

  // create a static method for your validation
  static validateDecimals(decimals: number): ValidatorFn {
    return (control: FormControl): ObjectModel<boolean> => {
      // first check if the control has a value
      if (control.value) {
        // match the control value against the regular expression
        const matches = control.value.toString().match(`^-?[0-9]+(\.[0-9]{1,${decimals}})?$`);
        // if there are not matches return an object, else return null.
        return !matches ? { decimals: true } : null;
      } else {
        return null;
      }
    };
  }

  static validateAdam(): ValidatorFn {
    return (control: FormControl & AdamControl): ObjectModel<boolean> => {
      if (control.adamItems == null) { return { required: true }; }

      if (control.adamItems === 0) {
        return { required: true };
      }

      return null;
    };
  }
}
