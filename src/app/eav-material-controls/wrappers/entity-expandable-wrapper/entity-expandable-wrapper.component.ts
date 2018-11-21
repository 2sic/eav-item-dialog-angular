import { Component, OnInit, ViewContainerRef, ViewChild, Input, AfterViewInit, ElementRef } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { FieldWrapper } from '../../../eav-dynamic-form/model/field-wrapper';
import { FieldConfig } from '../../../eav-dynamic-form/model/field-config';
import { ValidationMessagesService } from '../../validators/validation-messages-service';
import { EntityInfo } from '../../../shared/models/eav/entity-info';
import { EntityService } from '../../../shared/services/entity.service';
import { EavConfiguration } from '../../../shared/models/eav-configuration';
import { EavService } from '../../../shared/services/eav.service';
import { ContentExpandAnimation } from '../../../shared/animations/content-expand-animation';
import { TranslateService } from '@ngx-translate/core';
import { Helper } from '../../../shared/helpers/helper';

@Component({
  selector: 'app-entity-expandable-wrapper',
  templateUrl: './entity-expandable-wrapper.component.html',
  styleUrls: ['./entity-expandable-wrapper.component.scss'],
  animations: [ContentExpandAnimation],
})

export class EntityExpandableWrapperComponent implements FieldWrapper, OnInit, AfterViewInit {
  @ViewChild('fieldComponent', { read: ViewContainerRef }) fieldComponent: ViewContainerRef;

  @Input() config: FieldConfig;
  group: FormGroup;

  dialogIsOpen = false;

  get availableEntities(): EntityInfo[] { return this.config.availableEntities || []; }

  get value() {
    return Helper.convertValueToArray(this.group.controls[this.config.name].value, this.separator);
  }

  get id() {
    return `${this.config.entityId}${this.config.index}`;
  }

  get inputInvalid() {
    return this.group.controls[this.config.name].invalid;
  }

  get enableAddExisting() {
    return this.config.settings.EnableAddExisting || false;
  }

  get entityType() {
    return this.config.settings.EntityType || '';
  }

  get separator() { return this.config.settings.Separator || ','; }

  private entityTextDefault = this.translate.instant('FieldType.Entity.EntityNotFound');
  private eavConfig: EavConfiguration;

  constructor(private validationMessagesService: ValidationMessagesService,
    private entityService: EntityService,
    private eavService: EavService,
    private translate: TranslateService) {
    this.eavConfig = this.eavService.getEavConfiguration();
  }

  ngOnInit() {
    // this.setAvailableEntities();
  }

  ngAfterViewInit() {
  }

  // TODO: same method in entity - !!!
  getEntityText = (value): string => {
    if (value === null) {
      return 'empty slot';
    }
    const entities = this.availableEntities.filter(f => f.Value === value);
    if (entities.length > 0) {
      return entities.length > 0 ? entities[0].Text :
        this.entityTextDefault ? this.entityTextDefault : value;
    }
    return value;
  }
}