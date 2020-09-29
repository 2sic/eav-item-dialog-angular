import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { map } from 'rxjs/operators';
import { SaveStatusDialogComponent } from '../../eav-material-controls/dialogs/save-status-dialog/save-status-dialog.component';
import { LanguageService } from '../../shared/store/ngrx-data/language.service';
import { PublishMode } from '../multi-item-edit-form/multi-item-edit-form.constants';

@Component({
  selector: 'app-multi-item-edit-form-header',
  templateUrl: './multi-item-edit-form-header.component.html',
  styleUrls: ['./multi-item-edit-form-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MultiItemEditFormHeaderComponent implements OnInit {
  @Input() formId: number;
  @Input() isCopy: boolean;
  @Input() formsAreValid: boolean;
  @Input() allControlsAreDisabled: boolean;
  @Input() isParentDialog: boolean;
  @Input() publishMode: PublishMode;
  @Output() private closeDialog = new EventEmitter<null>();
  @Output() private setPublishMode = new EventEmitter<PublishMode>();

  hasLanguages$ = this.languageService.entities$.pipe(map(languages => languages.length > 0));

  constructor(private dialog: MatDialog, private languageService: LanguageService) { }

  ngOnInit() {
  }

  close() {
    this.closeDialog.emit();
  }

  openSaveStatusDialog() {
    const dialogRef = this.dialog.open(SaveStatusDialogComponent, {
      panelClass: 'c-save-status-dialog',
      autoFocus: false,
      width: '350px',
      data: this.publishMode
    });
    dialogRef.keydownEvents().subscribe(e => {
      const CTRL_S = e.keyCode === 83 && (navigator.platform.match('Mac') ? e.metaKey : e.ctrlKey);
      if (!CTRL_S) { return; }
      e.preventDefault();
    });
    dialogRef.afterClosed().subscribe((res: PublishMode) => {
      if (res == null) { return; }
      this.setPublishMode.emit(res);
    });
  }
}
