import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { ColDef, AllCommunityModules, GridReadyEvent, CellClickedEvent, GridApi, ValueGetterParams } from '@ag-grid-community/all-modules';

import { ContentItemsService } from './services/content-items.service';
import { ContentItem } from './models/content-item.model';
import { Field } from '../content-type-fields/models/field.model';
import { EditForm } from '../app-administration/shared/models/edit-form.model';
import { EntitiesService } from './services/entities.service';
import { ContentExportService } from '../app-administration/shared/services/content-export.service';
import { eavConstants, EavMetadataKey, EavKeyTypeKey } from '../shared/constants/eav-constants';
import { PubMetaFilterComponent } from './ag-grid-components/pub-meta-filter/pub-meta-filter.component';
import { ExtendedColDef } from './models/extended-col-def.model';
import { ContentItemsStatusComponent } from './ag-grid-components/content-items-status/content-items-status.component';
import { ContentItemsActionsComponent } from './ag-grid-components/content-items-actions/content-items-actions.component';
import { ContentItemsActionsParams } from './models/content-items-actions-params';
import { ContentItemsEntityComponent } from './ag-grid-components/content-items-entity/content-items-entity.component';
import { PubMeta } from './ag-grid-components/pub-meta-filter/pub-meta-filter.model';
import { BooleanFilterComponent } from '../shared/components/boolean-filter/boolean-filter.component';
import { keyFilters } from '../shared/constants/sessions-keys';
import { buildFilterModel } from './content-items.helpers';
import { IdFieldComponent } from '../shared/components/id-field/id-field.component';
import { angularConsoleLog } from '../shared/helpers/angular-console-log';

@Component({
  selector: 'app-content-items',
  templateUrl: './content-items.component.html',
  styleUrls: ['./content-items.component.scss']
})
export class ContentItemsComponent implements OnInit, OnDestroy {
  items: ContentItem[];

  private gridApi: GridApi;
  frameworkComponents = {
    pubMetaFilterComponent: PubMetaFilterComponent,
    booleanFilterComponent: BooleanFilterComponent,
    idFieldComponent: IdFieldComponent,
    contentItemsStatusComponent: ContentItemsStatusComponent,
    contentItemsActionsComponent: ContentItemsActionsComponent,
    contentItemsEntityComponent: ContentItemsEntityComponent,
  };
  modules = AllCommunityModules;

  private contentTypeStaticName: string;
  private subscription = new Subscription();
  private hasChild: boolean;

  constructor(
    private dialogRef: MatDialogRef<ContentItemsComponent>,
    private router: Router,
    private route: ActivatedRoute,
    private contentItemsService: ContentItemsService,
    private entitiesService: EntitiesService,
    private contentExportService: ContentExportService,
    private snackBar: MatSnackBar,
  ) {
    this.hasChild = !!this.route.snapshot.firstChild;
    this.contentTypeStaticName = this.route.snapshot.paramMap.get('contentTypeStaticName');
  }

  ngOnInit() {
    this.fetchItems();
    this.refreshOnChildClosed();
    this.contentItemsService.getColumns(this.contentTypeStaticName).subscribe(columns => {
      const columnDefs = this.buildColumnDefs(columns);
      this.gridApi.setColumnDefs(columnDefs);
      const filterModel = buildFilterModel(sessionStorage.getItem(keyFilters));
      if (filterModel) {
        angularConsoleLog('Will try to apply filter:', filterModel);
        this.gridApi.setFilterModel(filterModel);
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.subscription = null;
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }

  private fetchItems() {
    this.contentItemsService.getAll(this.contentTypeStaticName).subscribe(items => {
      this.items = items;
    });
  }

  editItem(params: CellClickedEvent) {
    let form: EditForm;
    if (params === null) {
      form = {
        items: [{ ContentTypeName: this.contentTypeStaticName }],
      };
    } else {
      const item: ContentItem = params.data;
      form = {
        items: [{ EntityId: item.Id.toString() }],
      };
    }
    this.router.navigate([`edit/${JSON.stringify(form)}`], { relativeTo: this.route });
  }

  exportContent() {
    const filterModel = this.gridApi.getFilterModel();
    const hasFilters = Object.keys(filterModel).length > 0;
    const ids: number[] = [];
    if (hasFilters) {
      this.gridApi.forEachNodeAfterFilterAndSort(rowNode => {
        ids.push((rowNode.data as ContentItem).Id);
      });
    }
    this.router.navigate([`export/${this.contentTypeStaticName}${ids.length > 0 ? `/${ids}` : ''}`], { relativeTo: this.route });
  }

  importItem() {
    this.router.navigate(['import'], { relativeTo: this.route });
  }

  addMetadata() {
    if (!confirm(
      'This is a special operation to add an item which is metadata for another item.'
      + ' If you didn\'t understand that, this is not for you :). Continue?'
    )) { return; }

    const metadataKeys = Object.keys(eavConstants.metadata) as EavMetadataKey[];
    const validTargetTypes = metadataKeys.map(metaKey => eavConstants.metadata[metaKey].type);
    const targetType = parseInt(prompt(
      'What kind of assignment do you want?'
      + metadataKeys.map(metaKey => `\n${eavConstants.metadata[metaKey].type}: ${eavConstants.metadata[metaKey].target}`),
      eavConstants.metadata.entity.type.toString()
    ), 10);
    if (!targetType) { return alert('No target type entered. Cancelled'); }
    if (!validTargetTypes.includes(targetType)) { return alert('Invalid target type. Cancelled'); }

    const key = prompt('What key do you want?');
    if (!key) { return alert('No key entered. Cancelled'); }

    const keyTypeKeys = Object.keys(eavConstants.keyTypes) as EavKeyTypeKey[];
    const validKeyTypes = keyTypeKeys.map(keyTypeKey => eavConstants.keyTypes[keyTypeKey]);
    const keyType = prompt(
      'What key type do you want?'
      + keyTypeKeys.map(keyTypeKey => `\n${eavConstants.keyTypes[keyTypeKey]}`),
      eavConstants.keyTypes.number
    );
    if (!keyType) { return alert('No key type entered. Cancelled'); }
    if (!validKeyTypes.includes(keyType)) { return alert('Invalid key type. Cancelled'); }
    if (keyType === eavConstants.keyTypes.number && !parseInt(key, 10)) {
      return alert('Key type number and key don\'t match. Cancelled');
    }

    let target: string;
    for (const metaKey of metadataKeys) {
      if (targetType !== eavConstants.metadata[metaKey].type) { continue; }
      target = eavConstants.metadata[metaKey].target;
    }

    const form: EditForm = {
      items: [{
        ContentTypeName: this.contentTypeStaticName,
        For: {
          Target: target,
          ...(keyType === eavConstants.keyTypes.guid && { Guid: key }),
          ...(keyType === eavConstants.keyTypes.number && { Number: parseInt(key, 10) }),
          ...(keyType === eavConstants.keyTypes.string && { String: key }),
        },
      }],
    };
    this.router.navigate([`edit/${JSON.stringify(form)}`], { relativeTo: this.route });
  }

  debugFilter() {
    console.warn('Current filter:', this.gridApi.getFilterModel());
    alert('Check console for filter information');
  }

  closeDialog() {
    this.dialogRef.close();
  }

  private refreshOnChildClosed() {
    this.subscription.add(
      this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((event: NavigationEnd) => {
        const hadChild = this.hasChild;
        this.hasChild = !!this.route.snapshot.firstChild;
        if (!this.hasChild && hadChild) {
          this.fetchItems();
        }
      })
    );
  }

  private buildColumnDefs(columns: Field[]) {
    const columnDefs: ColDef[] = [
      {
        headerName: 'ID', field: 'Id', width: 70, headerClass: 'dense', cellClass: 'id-action no-padding no-outline',
        cellRenderer: 'idFieldComponent', sortable: true, filter: 'agTextColumnFilter', valueGetter: this.idValueGetter,
      },
      {
        headerName: 'Status', field: 'Status', width: 80, headerClass: 'dense', cellClass: 'no-outline',
        filter: 'pubMetaFilterComponent', cellRenderer: 'contentItemsStatusComponent', valueGetter: this.valueGetterStatus,
      },
      {
        headerName: 'Title', field: '_Title', flex: 2, minWidth: 250, cellClass: 'primary-action highlight',
        sortable: true, filter: 'agTextColumnFilter', onCellClicked: this.editItem.bind(this),
      },
      {
        cellClass: 'secondary-action no-padding', width: 120, cellRenderer: 'contentItemsActionsComponent',
        cellRendererParams: {
          onClone: this.clone.bind(this),
          onExport: this.export.bind(this),
          onDelete: this.delete.bind(this),
        } as ContentItemsActionsParams,
      },
    ];
    for (const column of columns) {
      if (column.IsTitle) { continue; }
      const colDef: ExtendedColDef = {
        headerName: column.StaticName, field: column.StaticName, flex: 2, minWidth: 250, cellClass: 'no-outline',
        sortable: true,
      };
      switch (column.Type) {
        case 'Entity':
          try {
            colDef.allowMultiValue = column.Metadata.Entity.AllowMultiValue;
          } catch (e) {
            colDef.allowMultiValue = true;
          }
          colDef.cellRenderer = 'contentItemsEntityComponent';
          colDef.valueGetter = this.valueGetterEntityField;
          colDef.filter = 'agTextColumnFilter';
          break;
        case 'DateTime':
          try {
            colDef.useTimePicker = column.Metadata.DateTime.UseTimePicker;
          } catch (e) {
            colDef.useTimePicker = false;
          }
          colDef.valueGetter = this.valueGetterDateTime;
          colDef.filter = 'agTextColumnFilter';
          break;
        case 'Boolean':
          colDef.valueGetter = this.valueGetterBoolean;
          colDef.filter = 'booleanFilterComponent';
          break;
        case 'Number':
          colDef.filter = 'agNumberColumnFilter';
          break;
        default:
          colDef.filter = 'agTextColumnFilter';
          break;
      }
      columnDefs.push(colDef);
    }
    return columnDefs;
  }

  private clone(item: ContentItem) {
    const form: EditForm = {
      items: [{ ContentTypeName: this.contentTypeStaticName, DuplicateEntity: item.Id }],
    };
    this.router.navigate([`edit/${JSON.stringify(form)}`], { relativeTo: this.route });
  }

  private export(item: ContentItem) {
    this.contentExportService.exportEntity(item.Id, this.contentTypeStaticName, true);
  }

  private delete(item: ContentItem) {
    if (!confirm(`Delete '${item._Title}' (${item._RepositoryId})?`)) { return; }
    this.snackBar.open('Deleting...');
    this.entitiesService.delete(this.contentTypeStaticName, item._RepositoryId, false).subscribe({
      next: () => {
        this.snackBar.open('Deleted', null, { duration: 2000 });
        this.fetchItems();
      },
      error: (err: HttpErrorResponse) => {
        this.snackBar.dismiss();
        if (!confirm(`${err.error.ExceptionMessage}\n\nDo you want to force delete '${item._Title}' (${item._RepositoryId})?`)) {
          return;
        }
        this.snackBar.open('Deleting...');
        this.entitiesService.delete(this.contentTypeStaticName, item._RepositoryId, true).subscribe(() => {
          this.snackBar.open('Deleted', null, { duration: 2000 });
          this.fetchItems();
        });
      }
    });
  }

  private idValueGetter(params: ValueGetterParams) {
    const item: ContentItem = params.data;
    return `ID: ${item.Id}\nRepoID: ${item._RepositoryId}\nGUID: ${item.Guid}`;
  }

  private valueGetterStatus(params: ValueGetterParams) {
    const item: ContentItem = params.data;
    const published: PubMeta = {
      published: item.IsPublished,
      metadata: !!item.Metadata,
    };
    return published;
  }

  private valueGetterEntityField(params: ValueGetterParams) {
    const rawValue: ContentItem[] = params.data[params.colDef.field];
    if (rawValue.length === 0) { return null; }
    return rawValue.map(item => item.Title);
  }

  private valueGetterDateTime(params: ValueGetterParams) {
    const rawValue: string = params.data[params.colDef.field];
    if (!rawValue) { return null; }

    // remove 'Z' and replace 'T'
    return (params.colDef as ExtendedColDef).useTimePicker ? rawValue.substring(0, 19).replace('T', ' ') : rawValue.substring(0, 10);
  }

  private valueGetterBoolean(params: ValueGetterParams) {
    const rawValue = params.data[params.colDef.field];
    if (typeof rawValue !== 'boolean') { return null; }
    return rawValue.toString();
  }
}