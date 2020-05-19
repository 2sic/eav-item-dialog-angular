import { Subscription } from 'rxjs';

import { EavCustomInputField, Connector } from '../../../edit-types';
import { buildTemplate } from '../shared/helpers';
import * as template from './preview.html';
import * as styles from './preview.css';
import { ElementEventListener } from '../../../shared/element-event-listener.model';
import { webpackConsoleLog } from '../../../shared/webpack-console-log.helper';

export class FieldStringWysiwygPreview extends HTMLElement implements EavCustomInputField<string> {
  connector: Connector<string>;
  private subscription = new Subscription();
  private eventListeners: ElementEventListener[] = [];

  constructor() {
    super();
    webpackConsoleLog('FieldStringWysiwygPreview constructor called');
  }

  connectedCallback() {
    webpackConsoleLog('FieldStringWysiwygPreview connectedCallback called');
    this.innerHTML = buildTemplate(template.default, styles.default);
    const previewContainer: HTMLDivElement = this.querySelector('.wysiwyg-preview');
    if (this.connector.field.disabled) {
      previewContainer.classList.add('disabled');
    } else {
      const expand = () => { this.connector.expand(true); };
      previewContainer.addEventListener('click', expand);
      this.eventListeners.push({ element: previewContainer, type: 'click', listener: expand });
    }
    this.subscription.add(
      this.connector.data.value$.subscribe(value => {
        previewContainer.innerHTML = !value ? '' : value
          .replace('<hr sxc="sxc-content-block', '<hr class="sxc-content-block') // content block
          .replace(/<a[^>]*>(.*?)<\/a>/g, '$1'); // remove href from A tag
      })
    );
  }

  disconnectedCallback() {
    webpackConsoleLog('FieldStringWysiwygPreview disconnectedCallback called');
    this.eventListeners.forEach(listener => {
      listener.element.removeEventListener(listener.type, listener.listener);
    });
    this.eventListeners = null;
    this.subscription.unsubscribe();
    this.subscription = null;
  }
}

customElements.define('field-string-wysiwyg-preview', FieldStringWysiwygPreview);
