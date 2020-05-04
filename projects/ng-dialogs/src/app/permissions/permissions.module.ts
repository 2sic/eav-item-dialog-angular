import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatRippleModule } from '@angular/material/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AgGridModule } from '@ag-grid-community/angular';

import { PermissionsRoutingModule } from './permissions-routing.module';
import { PermissionsComponent } from './permissions.component';
import { PermissionsActionsComponent } from './ag-grid-components/permissions-actions/permissions-actions.component';
import { SharedComponentsModule } from '../shared/shared-components.module';
import { Context } from '../shared/services/context';
import { PermissionsService } from './services/permissions.service';
import { MetadataService } from './services/metadata.service';
import { EntitiesService } from '../content-items/services/entities.service';

@NgModule({
  declarations: [
    PermissionsComponent,
    PermissionsActionsComponent,
  ],
  entryComponents: [
    PermissionsComponent,
    PermissionsActionsComponent,
  ],
  imports: [
    CommonModule,
    PermissionsRoutingModule,
    SharedComponentsModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    AgGridModule.withComponents([]),
    MatRippleModule,
    MatSnackBarModule,
  ],
  providers: [
    Context,
    PermissionsService,
    MetadataService,
    EntitiesService,
  ]
})
export class PermissionsModule { }