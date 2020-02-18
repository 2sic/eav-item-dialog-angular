import { ValidatorFn, Validators } from '@angular/forms';

import { FieldSettings } from '../../shared/models/eav';
import { CustomValidators } from './custom-validators';
import { InputTypesConstants } from '../../shared/constants/input-types-constants';

export class ValidationHelper {

    public static getValidations(settings: FieldSettings): ValidatorFn[] {
        // important - a hidden field dont have validations and is not required
        const visibleInEditUI = (settings.VisibleInEditUI === false) ? false : true;
        return visibleInEditUI
            ? ValidationHelper.setDefaultValidations(settings)
            : [];
    }

    public static isRequired(settings: FieldSettings): boolean {
        const visibleInEditUI = (settings.VisibleInEditUI === false) ? false : true;

        return settings.Required && visibleInEditUI
            ? settings.Required
            : false;
    }

    /**
   * TODO: see can i write this in module configuration ???
   * @param inputType
   */
    private static setDefaultValidations(settings: FieldSettings): ValidatorFn[] {

        const validation: ValidatorFn[] = [];

        const required = settings.Required ? settings.Required : false;
        const isHyperlinkLibrary = settings.InputType === InputTypesConstants.hyperlinkLibrary;
        // hyperlink-library field will set custom required validator
        if (required && !isHyperlinkLibrary) {
            validation.push(Validators.required);
        }

        // const pattern = settings.ValidationRegex ? settings.ValidationRegex : '';
        // if (pattern) {
        //     validation.push(Validators.pattern(pattern));
        // }

        const pattern = settings.ValidationRegExJavaScript ? settings.ValidationRegExJavaScript : '';
        if (pattern) {
            validation.push(Validators.pattern(pattern));
        }

        // this.decimal = this.config.currentFieldConfig.settings.Decimals
        // ? `^[0-9]+(\.[0-9]{1,${this.config.currentFieldConfig.settings.Decimals}})?$`
        // : null;
        // const patternDecimals = settings.Decimals ? `^[0-9]+(\.[0-9]{1,${settings.Decimals}})?$` : '';
        // if (patternDecimals) {
        //     validation.push(Validators.pattern(patternDecimals));
        // }

        // const patternDecimals = settings.Decimals ? `^[0-9]+(\.[0-9]{1,${settings.Decimals}})?$` : '';
        if (settings.Decimals) {
            validation.push(CustomValidators.validateDecimals(settings.Decimals));
            console.log('settings validation: ', validation);
        }

        // TODO: See do we set this here or in control
        const max = settings.Max ? settings.Max : 0;
        if (max > 0) {
            validation.push(Validators.max(max));
        }

        // TODO: See do we set this here or in control
        const min = settings.Min ? settings.Min : 0;
        if (min > 0) {
            validation.push(Validators.min(min));
        }

        // if (inputType === InputTypesConstants.stringUrlPath) {
        //   validation = [...['onlySimpleUrlChars']];
        // }

        return validation;
    }
}
