import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { FieldConfigSet } from '../../../eav-dynamic-form/model/field-config';
import { ValidationMessagesService } from '../../validators/validation-messages-service';

@Component({
  selector: 'app-field-helper-text',
  templateUrl: './field-helper-text.component.html',
  styleUrls: ['./field-helper-text.component.scss']
})
export class FieldHelperTextComponent implements OnInit {

  @Input() config: FieldConfigSet;
  @Input() group: FormGroup;
  // @Input() hasDirtyTouched = true;
  @Input() disableError = false;

  isFullText = false;

  get inputInvalid() {
    return this.group.controls[this.config.field.name].invalid;
  }

  get disabled() {
    return this.group.controls[this.config.field.name].disabled;
  }

  getErrorMessage() {
    return this.validationMessagesService.getErrorMessage(this.group.controls[this.config.field.name], this.config);
  }

  constructor(private validationMessagesService: ValidationMessagesService) { }

  ngOnInit() {
  }
}
