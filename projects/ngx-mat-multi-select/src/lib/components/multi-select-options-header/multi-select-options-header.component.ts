import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgxMatMultiSelectOptionsHeaderBaseComponent } from './multi-select-options-header.base.component';

@Component({
  selector: 'ngx-mat-multi-select-options-header',
  templateUrl: './multi-select-options-header.component.html',
  styleUrls: ['./multi-select-options-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxMatMultiSelectOptionsHeaderComponent<T> extends NgxMatMultiSelectOptionsHeaderBaseComponent<T> {}
