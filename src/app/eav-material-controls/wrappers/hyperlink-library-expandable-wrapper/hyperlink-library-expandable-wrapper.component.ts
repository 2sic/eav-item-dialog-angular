import { Component, OnInit, ViewContainerRef, ViewChild, Input, AfterViewInit, ElementRef, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { FieldWrapper } from '../../../eav-dynamic-form/model/field-wrapper';
import { FieldConfig } from '../../../eav-dynamic-form/model/field-config';
import { ContentExpandAnimation } from '../../../shared/animations/content-expand-animation';
import { FileTypeService } from '../../../shared/services/file-type.service';
import { DnnBridgeService } from '../../../shared/services/dnn-bridge.service';
import { EavService } from '../../../shared/services/eav.service';
import { Subscription } from 'rxjs';
import { AdamItem } from '../../../shared/models/adam/adam-item';

@Component({
  selector: 'app-hyperlink-library-expandable-wrapper',
  templateUrl: './hyperlink-library-expandable-wrapper.component.html',
  styleUrls: ['./hyperlink-library-expandable-wrapper.component.scss'],
  animations: [ContentExpandAnimation]
})
export class HyperlinkLibraryExpandableWrapperComponent implements FieldWrapper, OnInit, AfterViewInit, OnDestroy {
  @ViewChild('fieldComponent', { read: ViewContainerRef }) fieldComponent: ViewContainerRef;

  @Input() config: FieldConfig;
  group: FormGroup;

  get value() {
    return this.group.controls[this.config.name].value;
  }

  get id() {
    return `${this.config.entityId}${this.config.index}`;
  }

  get inputInvalid() {
    return this.group.controls[this.config.name].invalid;
  }

  constructor(private fileTypeService: FileTypeService) { }

  ngOnInit() {
    // console.log('this.config.adam', this.config.adam);
  }

  ngAfterViewInit() {
    console.log('this.config.adam', this.config.adam);
  }

  ngOnDestroy() {
    // this.subscriptions.forEach(subscriber => subscriber.unsubscribe());
  }

  icon(item: AdamItem) {
    return this.fileTypeService.getIconClass(item.Name);
  }
}
