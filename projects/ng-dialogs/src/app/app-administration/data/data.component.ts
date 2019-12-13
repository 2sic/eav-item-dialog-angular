import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ColDef, AllCommunityModules, GridReadyEvent, GridSizeChangedEvent, CellClickedEvent } from '@ag-grid-community/all-modules';
import { Subscription } from 'rxjs';

import { Context } from '../../shared/context/context';
import { ContentType } from '../shared/models/content-type.model';
import { ContentTypesService } from '../shared/services/content-types.service';
import { DataNameComponent } from '../shared/ag-grid-components/data-name/data-name.component';
import { DataFieldsComponent } from '../shared/ag-grid-components/data-fields/data-fields.component';
import { DataActionsComponent } from '../shared/ag-grid-components/data-actions/data-actions.component';
import { EditContentTypeComponent } from '../shared/modals/edit-content-type/edit-content-type.component';
import { EditContentTypeDialogData } from '../shared/models/edit-content-type-dialog-data.model';
import { EavConfigurationService } from '../shared/services/eav-configuration.service';
import { DataActionsParams } from '../shared/models/data-actions-params';
import { DataNameParams } from '../shared/models/data-name-params';

@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.scss']
})
export class DataComponent implements OnInit, OnDestroy {
  @Input() context: Context;
  contentTypes: ContentType[];

  columnDefs: ColDef[] = [
    {
      headerName: 'Name', field: 'Name', cellClass: 'clickable-with-button', cellRenderer: 'dataNameComponent',
      onCellClicked: this.handleNameCellClicked.bind(this), cellRendererParams: <DataNameParams>{
        onAddItem: this.addItem.bind(this),
      }
    },
    { headerName: 'Description', field: 'Description', cellClass: 'clickable', onCellClicked: this.handleNameCellClicked.bind(this) },
    { headerName: 'Fields', width: 100, field: 'Items', cellRenderer: 'dataFieldsComponent' },
    {
      headerName: 'Actions', width: 200, cellRenderer: 'dataActionsComponent', cellRendererParams: <DataActionsParams>{
        onEdit: this.editContentType.bind(this),
        onDelete: this.deleteContentType.bind(this),
      }
    },
  ];
  frameworkComponents = {
    dataNameComponent: DataNameComponent,
    dataFieldsComponent: DataFieldsComponent,
    dataActionsComponent: DataActionsComponent,
  };
  modules = AllCommunityModules;

  private scope: string;
  private subscriptions: Subscription[] = [];
  private editContentTypeDialogRef: MatDialogRef<EditContentTypeComponent, any>;

  constructor(
    private dialog: MatDialog,
    private contentTypesService: ContentTypesService,
    private eavConfigurationService: EavConfigurationService,
  ) { }

  ngOnInit() {
    this.scope = this.eavConfigurationService.contentType.defaultScope; // spm figure out how scope works
    this.fetchContentTypes();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => { subscription.unsubscribe(); });
    this.subscriptions = null;
  }

  onGridReady(params: GridReadyEvent) {
    params.api.sizeColumnsToFit();
  }

  onGridSizeChanged(params: GridSizeChangedEvent) {
    params.api.sizeColumnsToFit();
  }

  handleNameCellClicked(params: CellClickedEvent) {
    const contentType = <ContentType>params.data;
    alert('Open content type data!');
    // open content type data modal
  }

  editContentType(contentType: ContentType) {
    const dialogData: EditContentTypeDialogData = {
      context: this.context,
      contentType: contentType,
    };
    this.editContentTypeDialogRef = this.dialog.open(EditContentTypeComponent, {
      backdropClass: 'edit-content-type-dialog-backdrop',
      panelClass: ['edit-content-type-dialog-panel', 'dialog-panel-small'],
      data: dialogData,
    });
    this.subscriptions.push(
      this.editContentTypeDialogRef.afterClosed().subscribe(() => {
        console.log('Edit content type dialog was closed.');
        this.fetchContentTypes();
      }),
    );
  }

  deleteContentType(contentType: ContentType) {
    console.log('Delete content type', contentType);
    if (confirm(`Are you sure you want to delete '${contentType.Name}' (${contentType.Id})?`)) {
      this.contentTypesService.delete(contentType, this.context.appId).subscribe((result: boolean) => {
        this.fetchContentTypes();
      });
    }
  }

  private fetchContentTypes() {
    this.contentTypesService.retrieveContentTypes(this.context.appId, this.scope)
      .subscribe((contentTypes: ContentType[]) => {
        this.contentTypes = contentTypes;
      });
  }

  private addItem(contentType: ContentType) {
    alert('Open Edit Ui');
  }

}
