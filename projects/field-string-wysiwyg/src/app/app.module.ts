import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injector } from '@angular/core';
import { createCustomElement } from '@angular/elements';

import { AppComponent } from './app.component';
import { TinymceWysiwygComponent } from './tinymce-wysiwyg/tinymce-wysiwyg.component';
import { EditorModule } from '@tinymce/tinymce-angular';
import { TinymceWysiwygConfig } from './services/tinymce-wysiwyg-config';
import { TinyMceDnnBridgeService } from './services/tinymce-dnnbridge-service';
import { TinyMceAdamService } from './services/tinymce-adam-service';

@NgModule({
  declarations: [
    AppComponent,
    TinymceWysiwygComponent
  ],
  imports: [
    BrowserModule,
    EditorModule
  ],
  providers: [
    TinymceWysiwygConfig,
    TinyMceDnnBridgeService,
    TinyMceAdamService,
  ],
  entryComponents: [AppComponent, TinymceWysiwygComponent]
})
export class AppModule {
  constructor(private injector: Injector) {
    const el = createCustomElement(TinymceWysiwygComponent, { injector });
    // if (customElements.get('field-string-wysiwyg')) {
    //   console.log('exist', customElements.get('field-string-wysiwyg'));
    // }
    // try {
    console.log('field-string-wysiwyg define', el);
    customElements.define('field-string-wysiwyg', el);
    // } catch (error) {
    //   console.log('error:', error);
    // }
  }
  ngDoBootstrap() { }
}

