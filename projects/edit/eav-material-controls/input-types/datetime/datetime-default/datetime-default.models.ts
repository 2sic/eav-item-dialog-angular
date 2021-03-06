import { BaseFieldTemplateVars } from '../../base/base-field-template-vars.model';

export interface DatetimeDefaultTemplateVars extends BaseFieldTemplateVars {
  useTimePicker: boolean;
  placeholder: string;
  required: boolean;
  label: string;
  value: string;
}
