import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AllCommunityModules, ColDef, GridReadyEvent, GridSizeChangedEvent, CellClickedEvent } from '@ag-grid-community/all-modules';

import { App } from '../../shared/models/app.model';
import { AppsListService } from '../shared/services/apps-list.service';
import { AppsListShowComponent } from '../shared/ag-grid-components/apps-list-show/apps-list-show.component';
import { AppsListActionsComponent } from '../shared/ag-grid-components/apps-list-actions/apps-list-actions.component';
import { AppsListActionsParams } from '../shared/models/apps-list-actions-params.model';
import { IMPORT_APP_DIALOG } from '../../shared/constants/dialog-names';
import { DialogService } from '../../shared/components/dialog-service/dialog.service';

@Component({
  selector: 'app-apps-list',
  templateUrl: './apps-list.component.html',
  styleUrls: ['./apps-list.component.scss']
})
export class AppsListComponent implements OnInit, OnDestroy {
  apps: App[];

  columnDefs: ColDef[] = [
    { headerName: 'Name', field: 'Name', cellClass: 'clickable', onCellClicked: this.openApp.bind(this) },
    { headerName: 'Folder', field: 'Folder', cellClass: 'clickable', onCellClicked: this.openApp.bind(this) },
    { headerName: 'Show', field: 'IsHidden', cellRenderer: 'appsListShowComponent', width: 100 },
    {
      headerName: 'Actions', cellRenderer: 'appsListActionsComponent', width: 100, cellRendererParams: <AppsListActionsParams>{
        onDelete: this.deleteApp.bind(this),
      }
    },
  ];
  frameworkComponents = {
    appsListShowComponent: AppsListShowComponent,
    appsListActionsComponent: AppsListActionsComponent,
  };
  modules = AllCommunityModules;

  private subscription: Subscription = new Subscription();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private appsListService: AppsListService,
    private dialogService: DialogService,
  ) { }

  ngOnInit() {
    this.fetchAppsList();

    this.subscription.add(
      this.dialogService.subToClosed([IMPORT_APP_DIALOG]).subscribe(dialog => {
        console.log('Dialog closed event captured:', dialog);
        this.fetchAppsList();
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.subscription = null;
  }

  onGridReady(params: GridReadyEvent) {
    params.api.sizeColumnsToFit();
  }

  onGridSizeChanged(params: GridSizeChangedEvent) {
    params.api.sizeColumnsToFit();
  }

  browseCatalog() {
    window.open('http://2sxc.org/apps');
  }

  createApp() {
    const name = prompt('Enter App Name (will also be used for folder)');
    if (!name) { return; }
    this.appsListService.create(name).subscribe(() => {
      this.fetchAppsList();
    });
  }

  importApp() {
    this.router.navigate(['import'], { relativeTo: this.route.firstChild });
  }

  fetchAppsList() {
    this.appsListService.getAll().subscribe(apps => {
      this.apps = apps;
    });
  }

  private deleteApp(app: App) {
    // tslint:disable-next-line:max-line-length
    const result = prompt(`This cannot be undone. To really delete this app, type 'yes!' or type/paste the app-name here: sure you want to delete '${app.Name}' (${app.Id})?`);
    if (result === null) {
      return;
    } else if (result === app.Name || result === 'yes!') {
      this.appsListService.delete(app.Id).subscribe(() => {
        this.fetchAppsList();
      });
    } else {
      alert('input did not match - will not delete');
    }
  }

  private openApp(params: CellClickedEvent) {
    const appId = (<App>params.data).Id;
    this.router.navigate([appId.toString()], { relativeTo: this.route.parent });
  }

}
