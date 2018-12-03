import { Component, OnInit, ViewContainerRef, ViewChild, Input, AfterViewInit, ElementRef, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { FieldWrapper } from '../../../eav-dynamic-form/model/field-wrapper';
import { FieldConfig } from '../../../eav-dynamic-form/model/field-config';
import { ContentExpandAnimation } from '../../../shared/animations/content-expand-animation';
import { FileTypeService } from '../../../shared/services/file-type.service';
import { DnnBridgeService } from '../../../shared/services/dnn-bridge.service';
import { EavService } from '../../../shared/services/eav.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-hyperlink-default-expandable-wrapper',
  templateUrl: './hyperlink-default-expandable-wrapper.component.html',
  styleUrls: ['./hyperlink-default-expandable-wrapper.component.scss'],
  animations: [ContentExpandAnimation],
})
export class HyperlinkDefaultExpandableWrapperComponent implements FieldWrapper, OnInit, OnDestroy {
  @ViewChild('fieldComponent', { read: ViewContainerRef }) fieldComponent: ViewContainerRef;
  @ViewChild('previewInputControl') previewInputControl;

  @Input() config: FieldConfig;
  group: FormGroup;

  dialogIsOpen = false;
  link = '';

  private eavConfig;
  private subscriptions: Subscription[] = [];

  get value() { return this.group.controls[this.config.name].value; }
  get id() { return `${this.config.entityId}${this.config.index}`; }
  get inputInvalid() { return this.group.controls[this.config.name].invalid; }
  get touched() { return this.group.controls[this.config.name].touched || false; }
  get disabled() { return this.group.controls[this.config.name].disabled; }

  constructor(private fileTypeService: FileTypeService,
    private dnnBridgeService: DnnBridgeService,
    private eavService: EavService) {
    this.eavConfig = this.eavService.getEavConfiguration();
  }

  ngOnInit() {
    this.setLink(this.value);
    this.suscribeValueChanges();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscriber => subscriber.unsubscribe());
  }

  isImage = () => this.fileTypeService.isImage(this.link);
  icon = () => this.fileTypeService.getIconClass(this.link);

  tooltipUrl = (str: string): string => {
    if (!str) {
      return '';
    }
    return str.replace(/\//g, '/&#8203;');
  }

  setValue(val) {
    if (val.target.value !== this.value) {
      this.group.controls[this.config.name].patchValue(val.target.value);
      this.group.controls[this.config.name].markAsTouched();
    }
  }

  thumbnailUrl(size: number, quote: boolean) {
    let result = this.link;
    if (size === 1) {
      result = result + '?w=70&h=70&mode=crop';
    }
    if (size === 2) {
      result = result + '?w=500&h=400&mode=max';
    }
    const qt = quote ? '"' : '';
    return qt + result + qt;
  }

  /**
   * Update test-link if necessary - both when typing or if link was set by dialogs
   * @param value
   */
  private setLink(value: string) {
    // const oldValue = this.value;
    if (!value) {
      return null;
    }
    // handle short-ID links like file:17
    const urlFromId$ = this.dnnBridgeService.getUrlOfId(this.eavConfig.appId,
      value,
      this.config.header.contentTypeName,
      this.config.header.guid,
      this.config.name);

    if (urlFromId$) {
      // this.subscriptions.push(
      urlFromId$.subscribe((data) => {
        if (data) {
          this.link = data;
        }
      });
      // );
    } else {
      this.link = value;
    }
  }

  /**
  * subscribe to form value changes. Only this field change
  *
  */
  private suscribeValueChanges() {
    this.subscriptions.push(
      this.group.controls[this.config.name].valueChanges.subscribe((item) => {
        this.setLink(item);
      })
    );
  }

}
