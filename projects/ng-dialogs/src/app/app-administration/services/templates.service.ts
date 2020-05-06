import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Context as DnnContext } from '@2sic.com/dnn-sxc-angular';

import { Context } from '../../shared/services/context';
import { View } from '../models/view.model';
import { Polymorphism } from '../models/polymorphism';

@Injectable()
export class TemplatesService {
  constructor(private http: HttpClient, private context: Context, private dnnContext: DnnContext) { }

  getAll() {
    return this.http.get(this.dnnContext.$2sxc.http.apiUrl('app-sys/template/getall'), {
      params: { appId: this.context.appId.toString() }
    }) as Observable<View[]>;
  }

  delete(id: number) {
    return this.http.get(this.dnnContext.$2sxc.http.apiUrl('app-sys/template/delete'), {
      params: { appId: this.context.appId.toString(), Id: id.toString() },
    }) as Observable<boolean>;
  }

  polymorphism() {
    return this.http.get(this.dnnContext.$2sxc.http.apiUrl('app-sys/template/polymorphism'), {
      params: { appId: this.context.appId.toString() }
    }) as Observable<Polymorphism>;
  }

}