import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { NgxMultiSelectItem } from '../../models/ngx-multi-select-item.model';
import { NgxMultiSelectLabels } from '../../models/ngx-multi-select-labels.model';
import { NgxMultiSelectStateService } from '../../services/multi-select-state.service';

@Component({
  selector: 'ngx-mat-multi-select-options-header-base',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxMatMultiSelectOptionsHeaderBaseComponent<T> implements OnInit {
  public allSelected$!: Observable<boolean>;
  public someSelected$!: Observable<boolean>;

  public labels$!: Observable<NgxMultiSelectLabels>;
  public options$!: Observable<NgxMultiSelectItem<T>[]>;

  constructor(private readonly multiSelectStateService: NgxMultiSelectStateService<T>) {}

  public ngOnInit(): void {
    this.allSelected$ = combineLatest([this.multiSelectStateService.selectedValues$, this.multiSelectStateService.options$]).pipe(
      map(([selectedValues, options]) => {
        const matchedOptions = options.filter((option) => selectedValues.some((value) => value === option.value));

        return selectedValues.length > 0 && selectedValues.length === matchedOptions.length;
      })
    );

    this.someSelected$ = combineLatest([this.multiSelectStateService.selectedValues$, this.multiSelectStateService.options$]).pipe(
      map(([selectedValues, options]) => {
        const matchedOptions = options.filter((option) => selectedValues.some((value) => value === option.value));

        return matchedOptions.length > 0 && selectedValues.length !== options.length;
      })
    );

    this.labels$ = this.multiSelectStateService.labels$;
    this.options$ = this.multiSelectStateService.options$;
  }

  public onCloseOptionsPanelClick(): void {
    this.multiSelectStateService.closeOptionsPanel();
  }
}
