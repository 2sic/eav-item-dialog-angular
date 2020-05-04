import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';

import { LanguageInstanceService } from '../store/ngrx-data/language-instance.service';

@Injectable()
export class ExpandableFieldService {
  private subscription: Subscription;
  private expandedField$$: BehaviorSubject<number>;
  private route: ActivatedRoute;

  constructor(private router: Router, private languageInstanceService: LanguageInstanceService) { }

  init(route: ActivatedRoute) {
    this.subscription = new Subscription();
    this.expandedField$$ = new BehaviorSubject(null);
    this.route = route;
    this.subscription.add(
      this.route.params.subscribe(params => {
        if (!params.hasOwnProperty('expandedFieldId')) {
          this.expandedField$$.next(null);
          return;
        }
        const expandedFieldId = parseInt(params.expandedFieldId, 10);
        this.expandedField$$.next(expandedFieldId);
      }),
    );
  }

  getObservable() {
    return this.expandedField$$.asObservable();
  }

  expand(expand: boolean, fieldId: number, formId: number) {
    this.languageInstanceService.updateHideHeader(formId, expand);
    this.updateUrl(expand, fieldId);
  }

  destroy() {
    this.subscription.unsubscribe();
    this.subscription = null;
    this.expandedField$$.unsubscribe();
    this.expandedField$$ = null;
    this.route = null;
  }

  private updateUrl(expand: boolean, fieldId: number) {
    let lastChild = this.route;
    while (lastChild.firstChild) {
      lastChild = lastChild.firstChild;
    }
    let currentUrl = '';
    for (const path of lastChild.snapshot.pathFromRoot) {
      if (path.url.length <= 0) { continue; }
      for (const urlSegment of path.url) {
        if (!urlSegment.path) { continue; }
        currentUrl += '/' + urlSegment.path;
      }
    }

    const routeParams = this.route.snapshot.params;
    const oldEditUrl = `edit/${routeParams.items}` + (routeParams.expandedFieldId ? `/details/${routeParams.expandedFieldId}` : '');
    const lastIndex = currentUrl.lastIndexOf(oldEditUrl);
    if (lastIndex <= 0) { return; }
    const newEditUrl = `edit/${routeParams.items}` + (expand ? `/details/${fieldId}` : '');
    const newUrl = currentUrl.substring(0, lastIndex) + currentUrl.substring(lastIndex).replace(oldEditUrl, newEditUrl);
    this.router.navigate([newUrl]);
  }
}