import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridModule } from '@ag-grid-community/angular';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTabsModule } from '@angular/material/tabs';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCardModule } from '@angular/material/card';
import { MatRippleModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { EcoFabSpeedDialModule } from '@ecodev/fab-speed-dial';

import { AppAdministrationNavComponent } from './app-administration-nav/app-administration-nav.component';
import { GettingStartedComponent } from './getting-started/getting-started.component';
import { DataComponent } from './data/data.component';
import { QueriesComponent } from './queries/queries.component';
import { ViewsComponent } from './views/views.component';
import { WebApiComponent } from './web-api/web-api.component';
import { AppConfigurationComponent } from './app-configuration/app-configuration.component';
import { Context } from '../shared/services/context';
import { AppAdministrationRoutingModule } from './app-administration-routing.module';
import { SharedComponentsModule } from '../shared/shared-components.module';
import { DataItemsComponent } from './ag-grid-components/data-items/data-items.component';
import { DataFieldsComponent } from './ag-grid-components/data-fields/data-fields.component';
import { DataActionsComponent } from './ag-grid-components/data-actions/data-actions.component';
import { QueriesActionsComponent } from './ag-grid-components/queries-actions/queries-actions.component';
import { ViewsTypeComponent } from './ag-grid-components/views-type/views-type.component';
import { ViewsShowComponent } from './ag-grid-components/views-show/views-show.component';
import { ViewsActionsComponent } from './ag-grid-components/views-actions/views-actions.component';
import { AppDialogConfigService } from './services/app-dialog-config.service';
import { ContentTypesService } from './services/content-types.service';
import { PipelinesService } from './services/pipelines.service';
import { TemplatesService } from './services/templates.service';
import { EditContentTypeComponent } from './modals/edit-content-type/edit-content-type.component';
import { ContentExportService } from './services/content-export.service';
import { ContentImportComponent } from './modals/content-import/content-import.component';
import { ContentImportService } from './services/content-import.service';
import { ImportQueryComponent } from './modals/import-query/import-query.component';
import { WebApisService } from './services/web-apis.service';
import { ContentItemsService } from '../content-items/services/content-items.service';
import { ExportAppComponent } from './modals/export-app/export-app.component';
import { ExportAppPartsComponent } from './modals/export-app-parts/export-app-parts.component';
import { ImportAppPartsComponent } from './modals/import-app-parts/import-app-parts.component';
import { ExportAppService } from './services/export-app.service';
import { ExportAppPartsService } from './services/export-app-parts.service';
import { ImportAppPartsService } from './services/import-app-parts.service';
import { WebApiActionsComponent } from './ag-grid-components/web-api-actions/web-api-actions.component';
import { SanitizeService } from '../../../../edit/eav-material-controls/adam/sanitize.service';
import { DialogService } from '../shared/services/dialog.service';

@NgModule({
  declarations: [
    GettingStartedComponent,
    AppAdministrationNavComponent,
    DataComponent,
    QueriesComponent,
    ViewsComponent,
    WebApiComponent,
    AppConfigurationComponent,
    DataItemsComponent,
    DataFieldsComponent,
    DataActionsComponent,
    QueriesActionsComponent,
    ViewsTypeComponent,
    ViewsShowComponent,
    ViewsActionsComponent,
    EditContentTypeComponent,
    ContentImportComponent,
    ImportQueryComponent,
    ExportAppComponent,
    ExportAppPartsComponent,
    ImportAppPartsComponent,
    WebApiActionsComponent,
  ],
  entryComponents: [
    AppAdministrationNavComponent,
    DataItemsComponent,
    DataFieldsComponent,
    DataActionsComponent,
    QueriesActionsComponent,
    ViewsTypeComponent,
    ViewsShowComponent,
    ViewsActionsComponent,
    EditContentTypeComponent,
    ContentImportComponent,
    ImportQueryComponent,
    ExportAppComponent,
    ExportAppPartsComponent,
    ImportAppPartsComponent,
    WebApiActionsComponent,
  ],
  imports: [
    AppAdministrationRoutingModule,
    SharedComponentsModule,
    MatDialogModule,
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    AgGridModule.withComponents([]),
    MatTabsModule,
    FormsModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    MatProgressSpinnerModule,
    MatCheckboxModule,
    MatExpansionModule,
    MatCardModule,
    MatRippleModule,
    EcoFabSpeedDialModule,
  ],
  providers: [
    Context,
    AppDialogConfigService,
    ContentTypesService,
    PipelinesService,
    TemplatesService,
    ContentExportService,
    ContentImportService,
    WebApisService,
    ContentItemsService,
    ExportAppService,
    ExportAppPartsService,
    ImportAppPartsService,
    SanitizeService,
    DialogService,
  ]
})
export class AppAdministrationModule { }
