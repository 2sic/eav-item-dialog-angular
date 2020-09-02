// tslint:disable-next-line:max-line-length
import { Component, OnInit, AfterViewInit, ViewChildren, QueryList, ElementRef, ChangeDetectionStrategy, ViewChild, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Subscription, combineLatest, BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { QueryDefinitionService } from '../services/query-definition.service';
import { PipelineDataSource, VisualDesignerData } from '../models/pipeline.model';
import { loadScripts } from '../../shared/helpers/load-scripts.helper';
import { PlumbEditorTemplateModel } from './plumb-editor.models';
import { Plumber, dataSrcIdPrefix } from './plumber.helper';
import { VisualQueryService } from '../services/visual-query.service';
import { calculateTypeInfos } from './plumb-editor.helpers';

const jsPlumbUrl = 'https://cdnjs.cloudflare.com/ajax/libs/jsPlumb/2.14.5/js/jsplumb.min.js';

@Component({
  selector: 'app-plumb-editor',
  templateUrl: './plumb-editor.component.html',
  styles: [':host { display: block; width: 100%; height: 100%; }'],
  styleUrls: ['./plumb-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlumbEditorComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('domRoot') private domRootRef: ElementRef<HTMLDivElement>;
  @ViewChildren('domDataSource') private domDataSourcesRef: QueryList<ElementRef<HTMLDivElement>>;

  dataSrcIdPrefix = dataSrcIdPrefix;
  templateModel$: Observable<PlumbEditorTemplateModel>;
  hardReset = false;

  private plumber: Plumber;
  private scriptLoaded$ = new BehaviorSubject(false);
  private subscription = new Subscription();
  private plumbInits = 0;

  constructor(
    private visualQueryService: VisualQueryService,
    private queryDefinitionService: QueryDefinitionService,
    private cd: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    loadScripts([{ test: 'jsPlumb', src: jsPlumbUrl }], () => {
      this.scriptLoaded$.next(true);
    });

    this.subscription.add(
      this.visualQueryService.forceRepaint$.subscribe(() => {
        this.plumber.repaint();
      })
    );

    this.subscription.add(
      this.visualQueryService.putEntityCountOnConnections$.subscribe(result => {
        this.plumber.putEntityCountOnConnections(result);
      })
    );

    this.templateModel$ = combineLatest([this.visualQueryService.pipelineModel$, this.visualQueryService.dataSources$]).pipe(
      map(combined => {
        const pipelineModel = combined[0];
        const dataSources = combined[1];
        if (pipelineModel == null || dataSources == null) { return; }

        // workaround for jsPlumb not working with dom elements which it initialized on previously.
        // This wipes dom entirely and gives us new elements
        this.hardReset = true;
        this.cd.detectChanges();
        this.hardReset = false;
        const templateModel: PlumbEditorTemplateModel = {
          pipelineDataSources: pipelineModel.DataSources,
          typeInfos: calculateTypeInfos(pipelineModel.DataSources, dataSources),
          allowEdit: pipelineModel.Pipeline.AllowEdit,
        };
        return templateModel;
      }),
    );
  }

  ngAfterViewInit() {
    // https://stackoverflow.com/questions/37087864/execute-a-function-when-ngfor-finished-in-angular-2/37088348#37088348
    const domDataSourcesLoaded$ = this.domDataSourcesRef.changes.pipe(map(() => true));

    this.subscription.add(
      combineLatest([this.scriptLoaded$, domDataSourcesLoaded$]).subscribe(combined => {
        const scriptLoaded = combined[0] === true;
        const domDataSourcesLoaded = combined[1] === true;
        if (!scriptLoaded || !domDataSourcesLoaded) { return; }

        this.plumber?.destroy();
        this.plumber = new Plumber(
          this.domRootRef.nativeElement,
          this.visualQueryService.pipelineModel$.value,
          this.visualQueryService.dataSources$.value,
          this.onConnectionsChanged.bind(this),
          this.onDragend.bind(this),
          ++this.plumbInits,
        );
      })
    );
  }

  ngOnDestroy() {
    this.plumber?.destroy();
    this.scriptLoaded$.complete();
    this.subscription.unsubscribe();
  }

  onConnectionsChanged() {
    const connections = this.plumber.getAllConnections();
    const streamsOut = this.plumber.getStreamsOut();
    this.visualQueryService.changeConnections(connections, streamsOut);
  }

  onDragend(pipelineDataSourceGuid: string, position: VisualDesignerData) {
    setTimeout(() => { this.visualQueryService.changeDataSourcePosition(pipelineDataSourceGuid, position); });
  }

  configureDataSource(dataSource: PipelineDataSource) {
    // ensure dataSource entity is saved
    if (dataSource.EntityGuid.includes('unsaved')) {
      this.visualQueryService.saveAndRun(true, false);
    } else {
      this.visualQueryService.editDataSource(dataSource);
    }
  }

  typeNameFilter(input: string, format: string) {
    const filtered = this.queryDefinitionService.typeNameFilter(input, format);
    return filtered;
  }

  remove(pipelineDataSource: PipelineDataSource) {
    if (!confirm(`Delete ${pipelineDataSource.Name} data source?`)) { return; }

    this.plumber.removeEndpointsOnDataSource(pipelineDataSource.EntityGuid);
    const connections = this.plumber.getAllConnections();
    const streamsOut = this.plumber.getStreamsOut();
    this.visualQueryService.removeDataSource(pipelineDataSource.EntityGuid, connections, streamsOut);
  }

  editName(dataSource: PipelineDataSource) {
    const newName = prompt('Rename data source', dataSource.Name)?.trim();
    if (newName == null || newName === '') { return; }

    this.visualQueryService.renameDataSource(dataSource.EntityGuid, newName);
  }

  editDescription(dataSource: PipelineDataSource) {
    const newDescription = prompt('Edit description', dataSource.Description)?.trim();
    if (newDescription == null) { return; }

    this.visualQueryService.changeDataSourceDescription(dataSource.EntityGuid, newDescription);
  }

}
