import { Component, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { DnnAppComponent, Context as DnnContext } from '@2sic.com/dnn-sxc-angular';

import { Context } from './shared/services/context';
import { keyModuleId, keyContentBlockId } from './shared/constants/session.constants';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent extends DnnAppComponent implements OnInit, OnDestroy {
  private subscription = new Subscription();

  constructor(
    el: ElementRef,
    dnnContext: DnnContext,
    private context: Context,
    private titleService: Title,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private matIconRegistry: MatIconRegistry,
  ) {
    super(
      el,
      dnnContext.preConfigure({
        moduleId: parseInt(sessionStorage.getItem(keyModuleId), 10),
        contentBlockId: parseInt(sessionStorage.getItem(keyContentBlockId), 10),
      }),
    );
    this.context.initRoot();
    this.matIconRegistry.setDefaultFontSetClass('material-icons-outlined');
  }

  ngOnInit() {
    // Mostly copied from https://blog.bitsrc.io/dynamic-page-titles-in-angular-98ce20b5c334
    // Routes need a data: { title: '...' } for this to work
    const appTitle = this.titleService.getTitle(); // initial title when loading the page
    this.subscription.add(this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => {
        let child = this.activatedRoute.firstChild;
        while (child.firstChild) {
          child = child.firstChild;
        }
        if (child.snapshot.data['title']) {
          return child.snapshot.data['title'];
        }
        return appTitle;
      })
    ).subscribe((title: string) => {
      this.titleService.setTitle(title);
    }));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
