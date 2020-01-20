import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ContentType } from '../models/content-type.model';
import { Field } from '../models/field.model';
import { Context } from '../../../shared/context/context';

@Injectable()
export class ContentTypesFieldsService {
  constructor(
    private http: HttpClient,
    private context: Context,
  ) { }

  getFields(contentType: ContentType) {
    return this.http.get('/desktopmodules/2sxc/api/eav/contenttype/getfields',
      { params: { appid: this.context.appId.toString(), staticName: contentType.StaticName } })
      .pipe(
        map((fields: Field[]) => {
          if (fields) {
            for (let i = 0; i < fields.length; i++) {
              const fld = fields[i];
              if (!fld.Metadata) { continue; }
              const md = fld.Metadata;
              const allMd = md.All;
              const typeMd = md[fld.Type];
              const inputMd = md[fld.InputType];
              md.merged = { ...allMd, ...typeMd, ...inputMd };
            }
          }
          return fields;
        })
      );
  }

  reOrder(idArray: number[], contentType: ContentType) {
    return <Observable<boolean>>this.http.get('/desktopmodules/2sxc/api/eav/contenttype/reorder', {
      params: {
        appid: this.context.appId.toString(),
        contentTypeId: contentType.Id.toString(),
        newSortOrder: JSON.stringify(idArray),
      }
    });
  }

  setTitle(item: Field, contentType: ContentType) {
    return <Observable<null>>this.http.get('/desktopmodules/2sxc/api/eav/contenttype/setTitle', {
      params: {
        appid: this.context.appId.toString(),
        contentTypeId: contentType.Id.toString(),
        attributeId: item.Id.toString(),
      }
    });
  }

  rename(item: Field, contentType: ContentType, newName: string) {
    return <Observable<null>>this.http.get('/desktopmodules/2sxc/api/eav/contenttype/rename', {
      params: {
        appid: this.context.appId.toString(),
        contentTypeId: contentType.Id.toString(),
        attributeId: item.Id.toString(),
        newName: newName,
      }
    });
  }

  delete(item: Field, contentType: ContentType) {
    if (item.IsTitle) { throw new Error('Can\'t delete Title'); }

    return <Observable<boolean>>this.http.get('/desktopmodules/2sxc/api/eav/contenttype/deletefield', {
      params: {
        appid: this.context.appId.toString(),
        contentTypeId: contentType.Id.toString(),
        attributeId: item.Id.toString(),
      }
    });
  }

}
