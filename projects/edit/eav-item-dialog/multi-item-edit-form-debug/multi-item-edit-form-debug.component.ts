import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { ItemService } from '../../shared/store/ngrx-data/item.service';
import { Observable, Subscription } from 'rxjs';
import { Item } from '../../shared/models/eav';
declare const sxcVersion: string;

@Component({
  selector: 'app-multi-item-edit-form-debug',
  templateUrl: './multi-item-edit-form-debug.component.html',
  styleUrls: ['./multi-item-edit-form-debug.component.scss']
})
export class MultiItemEditFormDebugComponent implements OnInit {
  @Output() debugInfoOpened: EventEmitter<boolean> = new EventEmitter<boolean>();

  sxcVer = sxcVersion.substring(0, sxcVersion.lastIndexOf('\.'));
  showDebugInfo = false;
  items$: Observable<Item[]>;
  items: Item[] = [];
  subscriptions: Subscription[] = [];

  constructor(private itemService: ItemService) { }

  ngOnInit() {
    this.items$ = this.itemService.selectAllItems();
    this.subscriptions.push(
      this.items$.subscribe(items => {
        this.items = items;
      })
    );
  }

  toggleDebugInfo() {
    this.showDebugInfo = !this.showDebugInfo;
    this.debugInfoOpened.emit(this.showDebugInfo);
  }
}