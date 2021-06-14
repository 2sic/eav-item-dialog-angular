import { Component, EventEmitter, Input, OnInit, Output, QueryList } from '@angular/core';
import { EavWindow } from '../../../ng-dialogs/src/app/shared/models/eav-window.model';
import { EavFormComponent } from '../../form/builder/eav-form/eav-form.component';
import { DebugType, DebugTypes } from './edit-dialog-footer.models';

declare const window: EavWindow;

@Component({
  selector: 'app-edit-dialog-footer',
  templateUrl: './edit-dialog-footer.component.html',
  styleUrls: ['./edit-dialog-footer.component.scss'],
})
export class EditDialogFooterComponent implements OnInit {
  @Input() eavFormRefs: QueryList<EavFormComponent>;
  @Output() private debugInfoOpened = new EventEmitter<boolean>();

  DebugTypes = DebugTypes;
  activeDebug: DebugType;
  sxcVer = window.sxcVersion.substring(0, window.sxcVersion.lastIndexOf('.'));

  constructor() { }

  ngOnInit(): void {
  }

  toggleDebugType(type: DebugType): void {
    this.activeDebug = type !== this.activeDebug ? type : null;
    this.debugInfoOpened.emit(this.activeDebug != null);
  }
}
