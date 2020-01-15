import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Context } from '../../../shared/context/context';
import { ImportAppResult } from '../models/import-app-result.model';

@Injectable()
export class ImportAppService {
  constructor(
    private http: HttpClient,
    private context: Context,
  ) { }

  importApp(file: File, changedName: string) {
    const formData = new FormData();
    formData.append('AppId', this.context.appId.toString());
    formData.append('ZoneId', this.context.zoneId.toString());
    formData.append('File', file);
    formData.append('Name', changedName ? changedName : '');
    return <Observable<ImportAppResult>>this.http.post('/desktopmodules/2sxc/api/app-sys/ImportExport/ImportApp', formData);
  }
}
