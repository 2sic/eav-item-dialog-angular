import { Directive, Input, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { distinctUntilChanged, filter, map, startWith } from 'rxjs/operators';
import { FieldSettings } from '../../../../edit-types';
import { Field } from '../../../eav-dynamic-form/model/field';
import { FieldConfigSet } from '../../../eav-dynamic-form/model/field-config';
import { EavService } from '../../../shared/services/eav.service';
import { FieldsSettings2NewService } from '../../../shared/services/fields-settings2new.service';
import { ValidationMessagesService } from '../../validators/validation-messages-service';

@Directive()
// tslint:disable-next-line:directive-class-suffix
export class BaseComponent<T> implements Field, OnInit, OnDestroy {
  @Input() config: FieldConfigSet;
  @Input() group: FormGroup;

  control: AbstractControl;
  settings$: BehaviorSubject<FieldSettings>;
  label$: Observable<string>;
  placeholder$: Observable<string>;
  value$: Observable<T>;
  disabled$: Observable<boolean>;
  required$: Observable<boolean>;
  invalid$: Observable<boolean>;
  showValidation$: Observable<AbstractControl>;
  subscription = new Subscription();

  constructor(
    public eavService: EavService,
    public validationMessagesService: ValidationMessagesService,
    public fieldsSettings2NewService: FieldsSettings2NewService,
  ) { }

  ngOnInit() {
    this.control = this.group.controls[this.config.fieldName];
    this.settings$ = new BehaviorSubject<FieldSettings>(null);
    this.subscription.add(
      this.fieldsSettings2NewService.getFieldSettings$(this.config.fieldName).subscribe(settings => {
        this.settings$.next(settings);
      })
    );
    this.label$ = this.settings$.pipe(map(settings => settings.Name));
    this.placeholder$ = this.settings$.pipe(map(settings => settings.Placeholder));
    this.required$ = this.settings$.pipe(map(settings => settings.Required));
    this.invalid$ = this.control.statusChanges.pipe(
      map(() => this.control.invalid),
      startWith(this.control.invalid),
    );
    this.showValidation$ = this.validationMessagesService.showValidation$.pipe(
      filter(control => control === this.control),
      startWith(this.control),
    );
    // doesn't work because controls are sometimes updated without emitting change (e.g. on language change)
    // this.value$ = this.control.valueChanges.pipe(
    //   startWith(this.control.value)
    // );
    // this.status$ = this.control.statusChanges.pipe(
    //   startWith(this.control.status)
    // );
    this.value$ = this.eavService.formValueChange$.pipe(
      filter(formSet => formSet.formId === this.eavService.eavConfig.formId && formSet.entityGuid === this.config.entityGuid),
      map(() => this.control.value),
      startWith(this.control.value),
      distinctUntilChanged(),
    );
    this.disabled$ = this.eavService.formDisabledChange$.pipe(
      filter(formSet => formSet.formId === this.eavService.eavConfig.formId && formSet.entityGuid === this.config.entityGuid),
      map(() => this.control.disabled),
      startWith(this.control.disabled),
      distinctUntilChanged(),
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
