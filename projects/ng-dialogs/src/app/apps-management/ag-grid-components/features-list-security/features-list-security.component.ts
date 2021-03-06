import { ICellRendererAngularComp } from '@ag-grid-community/angular';
import { ICellRendererParams } from '@ag-grid-community/core';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-features-list-security',
  templateUrl: './features-list-security.component.html',
  styleUrls: ['./features-list-security.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FeaturesListSecurityComponent implements ICellRendererAngularComp {

  agInit(params: ICellRendererParams) {
  }

  refresh(params?: any): boolean {
    return true;
  }
}
