import {
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  Component,
  ViewChild
} from '@angular/core';
import { Action } from '@ngrx/store';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { switchMap, filter } from 'rxjs/operators';
import { ValidatorFn } from '@angular/forms';

import {
  ContentType,
  Item,
  EavAttributes,
  EavAttributesTranslated,
} from '../../shared/models/eav';
import { Actions, ofType } from '@ngrx/effects';
import { AttributeDef } from '../../shared/models/eav/attribute-def';
import { ContentTypeService } from '../../shared/services/content-type.service';
import { EavFormComponent } from '../../eav-dynamic-form/components/eav-form/eav-form.component';
import { EavService } from '../../shared/services/eav.service';
import { Feature } from '../../shared/models/feature/feature';
import { FieldConfigSet } from '../../eav-dynamic-form/model/field-config';
import { InputTypesConstants } from '../../shared/constants/input-types-constants';
import { ItemService } from '../../shared/services/item.service';
import { LocalizationHelper } from '../../shared/helpers/localization-helper';
import { ValidationHelper } from '../../eav-material-controls/validators/validation-helper';
import * as fromItems from '../../shared/store/actions/item.actions';
import isEmpty from 'lodash/isEmpty';
import { InputFieldHelper } from '../../shared/helpers/input-field-helper';
import { EavConfiguration } from '../../shared/models/eav-configuration';

@Component({
  selector: 'app-item-edit-form',
  templateUrl: './item-edit-form.component.html',
  styleUrls: ['./item-edit-form.component.scss']
})
export class ItemEditFormComponent implements OnInit, OnChanges, OnDestroy {
  @ViewChild(EavFormComponent) form: EavFormComponent;

  @Output()
  itemFormValueChange: EventEmitter<any> = new EventEmitter<any>();

  @Input() defaultLanguage: string;
  @Input() features: Feature[];

  @Input()
  set currentLanguage(value: string) {
    this.currentLanguageValue = value;
    this.setFormValues(this.item, false); // need set emit to true because of  external commponents
  }
  get currentLanguage(): string {
    return this.currentLanguageValue;
  }

  @Input()
  set item(value: Item) {
    this.itemBehaviorSubject$.next(value);
  }
  get item(): Item {
    return this.itemBehaviorSubject$.getValue();
  }

  get allControlsAreDisabled() {
    return this.checkAreAllControlsDisabled();
  }

  private eavConfig: EavConfiguration;
  private currentLanguageValue: string;
  private itemBehaviorSubject$: BehaviorSubject<Item> = new BehaviorSubject<Item>(null);

  contentType$: Observable<ContentType>;
  itemFields$: Observable<FieldConfigSet[]>;
  formIsValid = false;

  constructor(
    private itemService: ItemService,
    private contentTypeService: ContentTypeService,
    private eavService: EavService,
    private actions$: Actions
  ) {
    this.eavConfig = eavService.getEavConfiguration();
  }

  ngOnInit() {
    this.itemBehaviorSubject$.subscribe((item: Item) => {
      this.setFormValues(item, false);
    });

    this.loadContentTypeFromStore();
  }

  ngOnDestroy(): void {
    this.itemBehaviorSubject$.unsubscribe();
  }

  ngOnChanges(): void { }

  /** Observe is item form is saved */
  formSaveObservable(): Observable<Action> {
    return this.actions$
      .pipe(ofType(fromItems.SAVE_ITEM_ATTRIBUTES_VALUES),
        filter((action: fromItems.SaveItemAttributesValuesAction) =>
          this.item.entity.id === 0
            ? this.item.entity.guid === action.item.entity.guid
            : this.item.entity.id === action.item.entity.id));
  }

  /**
   * Update NGRX/store on form value change
   * @param values key:value list of fields from form
   */
  formValueChange(values: { [key: string]: any }) {
    if (this.form.form.valid) {
      this.itemService.updateItemAttributesValues(
        this.item.entity.id, values, this.currentLanguage,
        this.defaultLanguage, this.item.entity.guid
      );
    }

    // emit event to parent
    this.itemFormValueChange.emit();
  }

  submit(values: { [key: string]: any }) {
    if (this.form.form.valid ||
      this.allControlsAreDisabled ||
      (this.item.header.group && this.item.header.group.slotCanBeEmpty)) {
      this.eavService.saveItem(Number(this.eavConfig.appId), this.item, values, this.currentLanguage, this.defaultLanguage);
    }
  }

  private checkAreAllControlsDisabled(): boolean {
    let allDisabled = true;
    Object.keys(this.form.form.controls).forEach(key => {
      if (!this.form.form.controls[key].disabled) {
        allDisabled = false;
      }
    });
    return allDisabled;
  }

  private setFormValues = (item: Item, emit: boolean) => {
    if (this.form) {
      const formValues: { [name: string]: any } = {};
      Object.keys(item.entity.attributes).forEach(attributeKey => {
        formValues[attributeKey] = LocalizationHelper.translate(this.currentLanguage,
          this.defaultLanguage, item.entity.attributes[attributeKey], null);
      });

      if (this.form.valueIsChanged(formValues)) {
        // set new values to form
        this.form.patchValue(formValues, emit);
      }
      // important to be after patchValue
      this.eavService.triggerFormSetValueChange(formValues);
    }
  }

  private loadContentTypeFromStore() {
    const id = this.item.entity.type === null
      ? this.item.header.contentTypeName
      : this.item.entity.type.id;
    // Load content type for item from store
    this.contentType$ = this.contentTypeService.getContentTypeById(id);
    // create form fields from content type
    this.itemFields$ = this.loadContentTypeFormFields();
  }

  /**
   * load FieldConfig for all fields from content type attributes
   */
  private loadContentTypeFormFields = (): Observable<FieldConfigSet[]> => {
    return this.contentType$
      .pipe(
        switchMap((data: ContentType) => {
          const parentFieldGroup: FieldConfigSet = this.buildEmptyFieldGroup(null, data.contentType.settings, false, 'Edit Item', true);
          let currentFieldGroup: FieldConfigSet = parentFieldGroup;

          const allInputTypeNames: string[] = InputFieldHelper.getInputTypeNamesFromAttributes(data.contentType.attributes);
          // loop through contentType attributes
          data.contentType.attributes.forEach((attribute, index) => {
            try {
              // if input type is empty-default create new field group and than continue to add fields to that group
              const isEmptyInputType = (attribute.settings.InputType &&
                attribute.settings.InputType.values[0].value === InputTypesConstants.emptyDefault) ||
                attribute.type === InputTypesConstants.empty;
              if (isEmptyInputType) { // group-fields (empty)
                const collapsed = attribute.settings.DefaultCollapsed
                  ? attribute.settings.DefaultCollapsed.values[0].value
                  : false;
                currentFieldGroup = this.buildEmptyFieldGroup(attribute, null, collapsed, 'Edit Item', false);
                parentFieldGroup.field.fieldGroup.push(currentFieldGroup);
              } else { // all other fields (not group empty)
                const formFieldConfig: FieldConfigSet = this.buildFieldFromDefinition(attribute, index, allInputTypeNames);
                currentFieldGroup.field.fieldGroup.push(formFieldConfig);
              }
            } catch (error) {
              console.error(`loadContentTypeFormFields(...) - error loading attribut ${index}`, attribute);
              throw error;
            }
          });

          return of([parentFieldGroup]);
        })
      );
  }

  private buildFieldFromDefinition(attribute: AttributeDef, index: number, allInputTypeNames: string[]): FieldConfigSet {
    try {
      const inputTypeName: string = InputFieldHelper.getInputTypeNameFromAttribute(attribute);
      return this.buildInputTypeFieldConfig(attribute, index, allInputTypeNames, inputTypeName);
    } catch (error) {
      console.error(`Error loading input fields: ${error}.
      Attribute name: ${attribute.name}
      Attribute input type: ${attribute.settings.InputType && attribute.settings.InputType.values[0].value
          ? attribute.settings.InputType.values[0].value : attribute.type}`);
      throw error;
    }
  }

  /**
   * Load inputType FieldConfig from AttributeDef
   */
  private buildInputTypeFieldConfig(attribute: AttributeDef, index: number, allInputTypeNames: string[],
    inputType: string): FieldConfigSet {
    const settingsTranslated: EavAttributesTranslated = LocalizationHelper.translateSettings(
      attribute.settings, this.currentLanguage, this.defaultLanguage
    );
    const validationList: ValidatorFn[] = ValidationHelper.getValidations(settingsTranslated);
    const required: boolean = ValidationHelper.isRequired(settingsTranslated);
    let value = LocalizationHelper.translate(
      this.currentLanguage,
      this.defaultLanguage,
      this.item.entity.attributes[attribute.name],
      null
    );
    // set default value if needed
    if (isEmpty(value) && typeof value !== typeof true && typeof value !== typeof 1) {
      value = this.itemService.setDefaultValue(this.item, attribute, inputType, settingsTranslated,
        this.currentLanguage, this.defaultLanguage);
      //  defaultValueIsSet = true;
    }
    // this.getFieldDisabled(attribute, settingsTranslated, defaultValueIsSet);
    const disabled: boolean = settingsTranslated.Disabled;
    const label: string = InputFieldHelper.getFieldLabel(attribute, settingsTranslated, null);
    const wrappers: string[] = InputFieldHelper.setWrappers(inputType, settingsTranslated);

    return {
      field: {
        disabled: disabled,
        fullSettings: attribute.settings,
        index: index,
        label: label,
        name: attribute.name,
        placeholder: `Enter ${attribute.name}`, // TODO: need to see what to use placeholder or label or both
        required: required,
        settings: settingsTranslated,
        inputType: inputType,
        type: attribute.type,
        validation: validationList,
        value: value,
        wrappers: wrappers,
      },
      itemConfig: {
        entityId: this.item.entity.id,
        entityGuid: this.item.entity.guid,
        header: this.item.header,
      },
      formConfig: {
        allInputTypeNames: allInputTypeNames, // TODO: maybe better way
        features: this.features,
      },
    };
  }

  /**
   * Create fieldConfig for title field group with collapsible wrapper
   */
  private buildEmptyFieldGroup = (
    attribute: AttributeDef,
    contentTypeSettings: EavAttributes,
    collapse: boolean,
    defaultValue: string,
    isParentGroup: boolean
  ): FieldConfigSet => {
    let settingsTranslated: EavAttributesTranslated = null;
    let fullSettings: EavAttributes = null;

    if (attribute) {
      settingsTranslated = LocalizationHelper.translateSettings(attribute.settings, this.currentLanguage, this.defaultLanguage);
      fullSettings = attribute.settings;
    } else if (contentTypeSettings) {
      settingsTranslated = LocalizationHelper.translateSettings(contentTypeSettings, this.currentLanguage, this.defaultLanguage);
      fullSettings = contentTypeSettings;
    }

    const label: string = InputFieldHelper.getFieldLabel(attribute, settingsTranslated, defaultValue);
    const name: string = attribute !== null ? attribute.name : defaultValue;

    return {
      itemConfig: {
        entityId: this.item.entity.id,
        entityGuid: this.item.entity.guid,
        header: this.item.header,
      },
      field: {
        fullSettings: fullSettings,
        collapse: collapse,
        fieldGroup: [],
        label: label,
        name: name,
        settings: settingsTranslated,
        inputType: InputTypesConstants.emptyDefault,
        isParentGroup: isParentGroup,
        //  type: attribute.type,
        wrappers: ['app-collapsible-wrapper'],
      }
    };
  }
}
