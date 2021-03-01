import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { combineLatest, Subscription } from 'rxjs';
import { distinctUntilChanged, filter, map, startWith } from 'rxjs/operators';
import { InputTypeConstants } from '../../../../ng-dialogs/src/app/content-type-fields/constants/input-type.constants';
import { FormValues } from '../../../eav-item-dialog/item-edit-form/item-edit-form.models';
import { GeneralHelpers } from '../../../shared/helpers/general.helpers';
import { EavService, FieldsSettingsService, FormsStateService } from '../../../shared/services';
import { ItemService } from '../../../shared/store/ngrx-data';

@Component({
  selector: 'app-eav-form',
  templateUrl: './eav-form.component.html',
  styleUrls: ['./eav-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EavFormComponent implements OnInit, OnDestroy {
  @Input() entityGuid: string;
  @Output() private formValueChange = new EventEmitter<FormValues>();

  form: FormGroup;
  private subscription: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private eavService: EavService,
    private formsStateService: FormsStateService,
    private itemService: ItemService,
    private fieldsSettingsService: FieldsSettingsService,
  ) { }

  ngOnInit() {
    this.form = new FormGroup({});
    this.subscription = new Subscription();
    this.subscription.add(
      this.fieldsSettingsService.getFieldsProps$().subscribe(fieldsProps => {
        // 1. create missing controls
        for (const [fieldName, fieldProps] of Object.entries(fieldsProps)) {
          if (fieldProps.calculatedInputType.inputType === InputTypeConstants.EmptyDefault) { continue; }
          const control = this.form.controls[fieldName];
          if (control != null) { continue; }

          const value = fieldProps.value;
          const disabled = fieldProps.settings.Disabled;
          const validation = fieldProps.validators;
          const newControl = this.formBuilder.control({ disabled, value }, validation);
          this.form.addControl(fieldName, newControl);
        }

        // 2. sync values
        const oldValues: FormValues = this.form.getRawValue();
        const newValues: FormValues = {};
        for (const [fieldName, fieldProps] of Object.entries(fieldsProps)) {
          if (!this.form.controls.hasOwnProperty(fieldName)) { continue; }
          newValues[fieldName] = fieldProps.value;
        }

        const changes = GeneralHelpers.getFormChanges(oldValues, newValues);
        if (changes != null) {
          this.form.patchValue(changes);
        }

        // important to be after patchValue
        this.eavService.formValueChange$.next({
          formId: this.eavService.eavConfig.formId,
          entityGuid: this.entityGuid,
          entityValues: newValues,
        });

        // 3. sync disabled
        for (const [fieldName, fieldProps] of Object.entries(fieldsProps)) {
          if (!this.form.controls.hasOwnProperty(fieldName)) { continue; }
          const control = this.form.controls[fieldName];
          const disabled = fieldProps.settings.Disabled;
          if (disabled === control.disabled) { continue; }

          if (disabled) {
            control.disable({ emitEvent: false });
          } else {
            control.enable({ emitEvent: false });
          }
          this.eavService.formDisabledChange$.next({ formId: this.eavService.eavConfig.formId, entityGuid: this.entityGuid });
        }

        // TODO: 4. sync validators
      })
    );

    const formValid$ = this.form.statusChanges.pipe(
      map(() => !this.form.invalid),
      startWith(!this.form.invalid),
      distinctUntilChanged(),
    );
    const itemHeader$ = this.itemService.getItemHeader$(this.entityGuid);
    this.subscription.add(
      combineLatest([formValid$, itemHeader$]).pipe(
        map(([formValid, itemHeader]) => {
          if (itemHeader.Group?.SlotIsEmpty) { return true; }
          return formValid;
        }),
        distinctUntilChanged(),
      ).subscribe(isValid => {
        this.formsStateService.setFormValid(this.entityGuid, isValid);
      })
    );
    this.subscription.add(
      this.eavService.formValueChange$.pipe(
        filter(formSet => formSet.formId === this.eavService.eavConfig.formId),
        map(() => this.form.dirty),
        // distinctUntilChanged(), // cant have distinctUntilChanged because dirty state is not reset on form save
      ).subscribe(isDirty => {
        this.formsStateService.setFormDirty(this.entityGuid, isDirty);
      })
    );

    this.subscription.add(
      this.form.valueChanges.subscribe(() => {
        this.formValueChange.emit(this.form.getRawValue());
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
