import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { DnnInterceptor } from '@2sic.com/dnn-sxc-angular';

import { EavService } from './shared/services/eav.service';
import { AdamService } from './eav-material-controls/adam/adam.service';
import { SvcCreatorService } from './shared/services/svc-creator.service';
import { DnnBridgeService } from './shared/services/dnn-bridge.service';
import { EntityService } from './shared/services/entity.service';
import { EavAdminUiService } from './shared/services/eav-admin-ui.service';
import { EavItemDialogModule } from './eav-item-dialog/eav-item-dialog.module';
import { QueryService } from './shared/services/query.service';
import { EditRoutingModule } from './edit-routing.module';
import { SharedComponentsModule } from '../ng-dialogs/src/app/shared/components/shared-components.module';
import { Context } from '../ng-dialogs/src/app/shared/context/context';
import { SanitizeService } from './eav-material-controls/adam/sanitize.service';
import { ExpandableFieldService } from './shared/services/expandable-field.service';
declare const sxcVersion: string;

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './i18n/', `.js?${sxcVersion}`);
}

@NgModule({
  declarations: [
  ],
  imports: [
    EditRoutingModule,
    SharedComponentsModule,
    CommonModule,
    EavItemDialogModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    })
  ],
  providers: [
    DnnInterceptor,
    EavService,
    AdamService,
    SvcCreatorService,
    DnnBridgeService,
    EntityService,
    EavAdminUiService,
    QueryService,
    Context,
    SanitizeService,
    ExpandableFieldService,
  ],
})
export class EditModule { }
