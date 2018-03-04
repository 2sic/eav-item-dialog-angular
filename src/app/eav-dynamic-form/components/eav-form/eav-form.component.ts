import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

import { FieldConfig } from '../../model/field-config.interface';

@Component({
  exportAs: 'appEavForm',
  templateUrl: './eav-form.component.html',
  selector: 'app-eav-form',
  styleUrls: ['./eav-form.component.css']
})
export class EavFormComponent implements OnChanges, OnInit {
  @Input()
  config: FieldConfig[] = [];

  @Output()
  submit: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  formValueChange: EventEmitter<any> = new EventEmitter<any>();

  // @Output()
  // change: EventEmitter<any> = new EventEmitter<any>();

  form: FormGroup = new FormGroup({});

  //get controls() { return this.config.filter(({ type }) => type !== 'button'); }
  // get controls() { return this.config }
  get changes() { return this.form.valueChanges; }
  get valid() { return this.form.valid; }
  get value() { return this.form.value; }

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    //let group = this.formBuilder.group({});
    this.createControlsInFormGroup(this.config);
    console.log('this.config sdfdsf:', JSON.stringify(this.config));
    console.log('group evo je:', JSON.stringify(this.form.value));

    this.form.valueChanges.subscribe(val => {
      this.formValueChange.emit(val);
    });
  }

  ngOnChanges() {
    console.log('ngOnChanges EavFormComponent');
    // TODO: see is this working
    if (this.form) {
      const controls = Object.keys(this.form.controls);
      const configControls = this.config.map((item) => item.name);

      controls
        .filter((control) => !configControls.includes(control))
        .forEach((control) => this.form.removeControl(control));

      configControls
        .filter((control) => !controls.includes(control))
        .forEach((name) => {
          const config = this.config.find((control) => control.name === name);
          this.form.addControl(name, this.createControl(config));
        });
    }
  }

  /**
   * Create form from configuration
   * @param fieldConfigArray 
   */
  createControlsInFormGroup(fieldConfigArray: FieldConfig[]) {
    // const group = this.formBuilder.group({});
    console.log('uslo:', fieldConfigArray);
    console.log('uslo group:', this.form);
    fieldConfigArray.forEach(fieldConfig => {
      console.log('fieldConfig.fieldGroup:', fieldConfig.fieldGroup);
      if (fieldConfig.fieldGroup) {
        this.createControlsInFormGroup(fieldConfig.fieldGroup);
        console.log('createControlsInFormGroup', fieldConfig.name);
      } else {
        this.form.addControl(fieldConfig.name, this.createControl(fieldConfig));
        console.log('createControl', fieldConfig.name);
      }
    }
    );

    console.log('idjem vratiti nest:', JSON.stringify(this.form.value));
    return this.form;
  }

  /**
   *  Create form control
   * @param config
   */
  createControl(config: FieldConfig) {
    const { disabled, validation, value } = config;
    return this.formBuilder.control({ disabled, value }, validation);
  }

  handleSubmit(event: Event) {
    console.log('Submit');
    event.preventDefault();
    event.stopPropagation();
    this.submit.emit(this.value);
  }

  setDisabled(name: string, disable: boolean) {
    if (this.form.controls[name]) {
      const method = disable ? 'disable' : 'enable';
      this.form.controls[name][method]();
      return;
    }

    this.config = this.config.map((item) => {
      if (item.name === name) {
        item.disabled = disable;
      }
      return item;
    });
  }

  setValue(name: string, value: any) {
    this.form.controls[name].setValue(value, { emitEvent: true });
  }
}

