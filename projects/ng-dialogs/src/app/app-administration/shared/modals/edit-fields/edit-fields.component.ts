import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
// tslint:disable-next-line:max-line-length
import { GridReadyEvent, GridSizeChangedEvent, AllCommunityModules, ColDef, RowDragEvent, GridApi, ICellRendererParams, CellClickedEvent } from '@ag-grid-community/all-modules';

import { ContentTypesService } from '../../services/content-types.service';
import { ContentTypesFieldsService } from '../../services/content-types-fields.service';
import { ContentType } from '../../models/content-type.model';
import { Field } from '../../models/field.model';
import { DialogService } from '../../../../shared/components/dialog-service/dialog.service';
import { CONTENT_TYPES_FIELDS_ADD_DIALOG } from '../../../../shared/constants/dialog-names';
import { eavConstants } from '../../../../shared/constants/eav-constants';

@Component({
  selector: 'app-edit-fields',
  templateUrl: './edit-fields.component.html',
  styleUrls: ['./edit-fields.component.scss']
})
export class EditFieldsComponent implements OnInit {
  fields: Field[];
  enableTextSelection = true;

  private gridApi: GridApi;
  columnDefs: ColDef[] = [
    {
      headerName: 'Title', field: 'IsTitle', rowDrag: true, cellClass: 'no-padding no-outline no-select',
      cellRenderer: (params: ICellRendererParams) => {
        return `
          <div class="icon-container">
            <i class="material-icons pointer" action="set-title" title="Use as title field">
              ${params.value ? 'star' : 'star_border'}
            </i>
          </div>
        `;
      }, onCellClicked: this.activateAction.bind(this),
    },
    { headerName: 'Static Name', field: 'StaticName', cellClass: 'clickable', onCellClicked: this.editContentType.bind(this) },
    { headerName: 'Data Type', field: 'Type', cellClass: 'clickable', onCellClicked: this.editContentType.bind(this) },
    {
      headerName: 'Input Type', field: 'InputType', cellClass: 'clickable-single-with-button no-outline no-select',
      cellRenderer: (params: ICellRendererParams) => {
        return `
          <div class="icon-container">
            <i class="material-icons pointer" action="change-input-type" title="Change Input Type">edit</i>
            &nbsp;
            <span class="text" action="change-input-type" title="Change Input Type">${params.value}</span>
          </div>
        `;
      }, onCellClicked: this.activateAction.bind(this),
    },
    { headerName: 'Label', field: 'Metadata.All.Name', cellClass: 'clickable', onCellClicked: this.editContentType.bind(this) },
    { headerName: 'Notes', field: 'Metadata.All.Notes', cellClass: 'clickable', onCellClicked: this.editContentType.bind(this) },
    {
      headerName: '', cellClass: 'no-padding no-outline no-select', cellRenderer: (params: ICellRendererParams) => {
        const field = <Field>params.data;
        const showPermissions = field.InputType === 'string-wysiwyg' || field.Type === 'Hyperlink';
        return `
          <div class="icon-container">
            <i class="material-icons pointer" action="rename" title="Rename">settings</i>
            &nbsp;
            <i class="material-icons pointer" action="delete" title="Delete">delete</i>
            ${showPermissions
            ? '&nbsp;<i class="material-icons pointer" action="permissions" title="Permissions">person</i>'
            : ''}
          </div>
        `;
      }, onCellClicked: this.activateAction.bind(this),
    },
  ];
  frameworkComponents = {
  };
  modules = AllCommunityModules;

  private contentTypeStaticName: string;
  private contentType: ContentType;
  private subscription: Subscription = new Subscription();

  constructor(
    private dialogRef: MatDialogRef<EditFieldsComponent>,
    private route: ActivatedRoute,
    private router: Router,
    private contentTypesService: ContentTypesService,
    private contentTypesFieldsService: ContentTypesFieldsService,
    private dialogService: DialogService,
  ) {
    this.contentTypeStaticName = this.route.snapshot.paramMap.get('contentTypeStaticName');
  }

  async ngOnInit() {
    this.contentType = await this.contentTypesService.retrieveContentType(this.contentTypeStaticName).toPromise();
    await this.fetchFields();
    this.refreshOnClosedChildDialogs();
  }

  onGridReady(params: GridReadyEvent) {
    params.api.sizeColumnsToFit();
  }

  onGridSizeChanged(params: GridSizeChangedEvent) {
    this.gridApi = params.api;
    params.api.sizeColumnsToFit();
  }

  onRowDragEnter(event: RowDragEvent) {
    this.enableTextSelection = false;
  }

  onRowDragEnd(event: RowDragEvent) {
    this.enableTextSelection = true;
    const idArray = this.fields.map(field => field.Id);
    this.contentTypesFieldsService.reOrder(idArray, this.contentType).subscribe(res => {
      this.fetchFields();
    });
  }

  onRowDragMove(event: RowDragEvent) {
    const movingNode = event.node;
    const overNode = event.overNode;
    const rowNeedsToMove = movingNode !== overNode;
    if (rowNeedsToMove) {
      const movingData = <Field>movingNode.data;
      const overData = <Field>overNode.data;
      const fromIndex = this.fields.indexOf(movingData);
      const toIndex = this.fields.indexOf(overData);
      const newStore = this.fields.slice();
      this.moveInArray(newStore, fromIndex, toIndex);
      this.fields = newStore;
      this.gridApi.setRowData(newStore);
      this.gridApi.clearFocusedCell();
    }
  }

  private moveInArray(arr: Field[], fromIndex: number, toIndex: number) {
    const element = arr[fromIndex];
    arr.splice(fromIndex, 1);
    arr.splice(toIndex, 0, element);
  }

  closeDialog() {
    this.dialogRef.close();
  }

  add() {
    this.router.navigate([`add`], { relativeTo: this.route });
  }

  private async fetchFields() {
    this.fields = await this.contentTypesFieldsService.getFields(this.contentType).toPromise();
  }

  private editContentType(params: CellClickedEvent) {
    const field = <Field>params.data;
    alert('Edit Content Type');
  }

  private activateAction(params: CellClickedEvent) {
    const field = <Field>params.data;
    const action = (<HTMLElement>(<MouseEvent>params.event).target).getAttribute('action');

    switch (action) {
      case 'set-title':
        this.contentTypesFieldsService.setTitle(<Field>params.data, this.contentType).subscribe(() => {
          this.fetchFields();
        });
        break;
      case 'change-input-type':
        alert('Change Input Type');
        break;
      case 'rename':
        const newName = prompt(`What new name would you like for '${field.StaticName}' (${field.Id})?`);
        if (!newName) { break; }
        this.contentTypesFieldsService.rename(field, this.contentType, newName).subscribe(() => {
          this.fetchFields();
        });
        break;
      case 'delete':
        if (field.IsTitle) { alert('Can\'t delete title'); break; }
        if (!confirm(`Are you sure you want to delete '${field.StaticName}' (${field.Id})?`)) { break; }
        this.contentTypesFieldsService.delete(field, this.contentType).subscribe(res => {
          this.fetchFields();
        });
        break;
      case 'permissions':
        this.router.navigate(
          [`${eavConstants.metadata.attribute.type}/${eavConstants.keyTypes.number}/${field.Id}/permissions`],
          { relativeTo: this.route }
        );
        break;
      default:
        return;
    }
  }

  private refreshOnClosedChildDialogs() {
    this.subscription.add(
      this.dialogService.subToClosed([CONTENT_TYPES_FIELDS_ADD_DIALOG]).subscribe(closedDialog => {
        console.log('Dialog closed event captured:', closedDialog);
        this.fetchFields();
      }),
    );
  }
}
