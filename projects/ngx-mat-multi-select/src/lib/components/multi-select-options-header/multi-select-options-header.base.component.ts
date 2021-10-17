import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { NgxMultiSelectItem } from '../../models/ngx-multi-select-item.model';
import { NgxMultiSelectLabels } from '../../models/ngx-multi-select-labels.model';
import { NgxMultiSelectStateService } from '../../services/multi-select-state.service';

@Component({
  selector: 'ngx-mat-multi-select-options-header-base',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxMatMultiSelectOptionsHeaderBaseComponent<T> implements OnInit {
  public labels$!: Observable<NgxMultiSelectLabels>;
  public options$!: Observable<NgxMultiSelectItem<T>[]>;

  constructor(private readonly multiSelectStateService: NgxMultiSelectStateService<T>) {}

  public ngOnInit(): void {
    this.labels$ = this.multiSelectStateService.labels$;
    this.options$ = this.multiSelectStateService.options$;
  }

  public onCloseOptionsPanelClick(): void {
    this.multiSelectStateService.closeOptionsPanel();
  }
}
