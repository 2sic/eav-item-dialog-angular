import { Component, Inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

import { SaveErrorsSnackData } from './snack-bar-save-errors.models';
import { FieldErrorMessage } from '../../../shared/models/eav/field-error-message';

@Component({
  selector: 'app-snack-bar-save-errors',
  templateUrl: './snack-bar-save-errors.component.html',
  styleUrls: ['./snack-bar-save-errors.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SnackBarSaveErrorsComponent implements OnInit {
  fieldErrors: FieldErrorMessage[] = [];

  constructor(@Inject(MAT_SNACK_BAR_DATA) private snackBarData: SaveErrorsSnackData) { }

  ngOnInit() {
    this.fieldErrors = this.snackBarData.fieldErrors;
  }
}
