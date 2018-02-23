import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl, ValidationErrors } from '@angular/forms';
import { FormlyModule, FormlyFieldConfig } from '@ngx-formly/core';
import {
  MatFormFieldModule,
  MatButtonModule,
  MatCheckboxModule,
  MatInputModule,
  MatSelectModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatCardModule,
  MatIconModule,
} from '@angular/material';
import {
  FormlyWrapperFormField,
  FormlyFieldInput,
  FormlyMaterialModule
} from '@ngx-formly/material';
import {
  PanelWrapperComponent,
  LabelWrapperComponent,
  CollapsibleWrapperComponent,
  HorizontalInputWrapperComponent,
  FormFieldWrapperComponent
} from './wrappers';
import {
  StringDefaultComponent,
  StringUrlPathComponent,
  StringDropdownComponent,
  StringDropdownQueryComponent,
  StringFontIconPickerComponent,
  BooleanDefaultComponent,
  DatetimeDefaultComponent,
  EmptyDefaultComponent,
  NumberDefaultComponent
} from './input-types';
import { InputTypesConstants } from '../shared/constants';
import { CustomValidators } from './validators/custom-validators';
import { ValidationMessages } from './validators/validation-messages';
import { TextEntryWrapperComponent } from './wrappers/text-entry-wrapper/text-entry-wrapper.component';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';

@NgModule({
  declarations: [
    // wrappers
    PanelWrapperComponent,
    LabelWrapperComponent,
    CollapsibleWrapperComponent,
    HorizontalInputWrapperComponent,
    FormFieldWrapperComponent,
    // types
    StringDefaultComponent,
    FormFieldWrapperComponent,
    StringUrlPathComponent,
    StringDropdownComponent,
    StringDropdownQueryComponent,
    StringFontIconPickerComponent,
    BooleanDefaultComponent,
    TextEntryWrapperComponent,
    DatetimeDefaultComponent,
    EmptyDefaultComponent,
    NumberDefaultComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatCheckboxModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCardModule,
    MatIconModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    FormlyModule.forRoot({
      wrappers: [
        { name: 'panel', component: PanelWrapperComponent },
        { name: 'label', component: LabelWrapperComponent },
        { name: 'collapsible', component: CollapsibleWrapperComponent },
        // { name: 'horizontal-wrapper', component: HorizontalInputWrapperComponent },
        // { name: 'form-field', component: FormlyWrapperFormField },
        { name: 'form-field-wrapper', component: FormFieldWrapperComponent }, // copy of FormlyWrapperFormField
        { name: 'text-entry-wrapper-component', component: TextEntryWrapperComponent }
      ],
      types: [
        // {
        //   name: 'horizontalInput',
        //   extends: 'input',
        //   wrappers: ['form-field', 'horizontal-wrapper']
        // },
        {
          name: InputTypesConstants.stringDefault,
          component: StringDefaultComponent,
          wrappers: ['form-field-wrapper'],
        },
        {
          name: InputTypesConstants.stringUrlPath,
          component: StringUrlPathComponent,
          wrappers: ['form-field-wrapper'],
          defaultOptions: {
            templateOptions: {
              type: 'text',
            },
          },
        },
        {
          name: InputTypesConstants.stringDropdown,
          component: StringDropdownComponent,
          // wrappers: ['form-field-wrapper', 'text-entry-wrapper-component'],
          wrappers: ['form-field-wrapper'],
          defaultOptions: {
            templateOptions: {
              type: 'text',
              labelProp: 'label',
              valueProp: 'value',
              groupProp: 'group'
            },
          },
        },
        {
          name: InputTypesConstants.booleanDefault,
          component: BooleanDefaultComponent,
          wrappers: ['form-field-wrapper'],
          defaultOptions: {
            templateOptions: {
              indeterminate: false,
              align: 'start'
            },
          },
        },
        {
          name: InputTypesConstants.datetimeDefault,
          component: DatetimeDefaultComponent,
          wrappers: ['form-field-wrapper'],
          defaultOptions: {
            defaultValue: new Date(),
            templateOptions: {
              datepickerOptions: {},
            },
          },
        },
        {
          name: InputTypesConstants.numberDefault,
          component: NumberDefaultComponent,
          wrappers: ['form-field-wrapper'],
        },
        // ,
        // {
        //   name: InputTypesConstants.emptyDefault,
        //   component: EmptyDefaultComponent,
        //   wrappers: ['collapsible'],
        // }
      ],
      validators: [
        { name: 'onlySimpleUrlChars', validation: CustomValidators.onlySimpleUrlChars(true, true) },
      ],
      validationMessages: [
        { name: 'onlySimpleUrlChars', message: ValidationMessages.onlySimpleUrlCharsValidatorMessage },
        { name: 'required', message: 'This field is required' },
        { name: 'pattern', message: ValidationMessages.patternValidationMessage },
      ],
    }),
  ],
})
export class EavFormlyMaterialModule { }
