import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { combineLatest, Observable, Subject, Subscription } from 'rxjs';
import { map, withLatestFrom } from 'rxjs/operators';
import { NgxMultiSelectItem } from '../../models/ngx-multi-select-item.model';
import { NgxMultiSelectLabels } from '../../models/ngx-multi-select-labels.model';
import { NgxMultiSelectStateService } from '../../services/multi-select-state.service';

@Component({
  selector: 'ngx-mat-multi-select-options-header-base',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxMatMultiSelectOptionsHeaderBaseComponent<T> implements OnInit, OnDestroy {
  public allSelected$!: Observable<boolean>;
  public someSelected$!: Observable<boolean>;

  public labels$!: Observable<NgxMultiSelectLabels>;
  public options$!: Observable<NgxMultiSelectItem<T>[]>;

  private readonly masterCheckboxToggleSubject = new Subject<boolean>();

  private readonly subscriptions = new Subscription();

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

    this.subscriptions.add(
      this.masterCheckboxToggleSubject.pipe(withLatestFrom(this.options$)).subscribe(([isSelected, options]) => {
        if (isSelected) {
          this.multiSelectStateService.toggleForcedSelection(options.map((option) => option.value));
        } else {
          this.multiSelectStateService.toggleForcedSelection([]);
        }
      })
    );
  }

  public ngOnDestroy(): void {
    this.masterCheckboxToggleSubject.complete();

    this.subscriptions.unsubscribe();
  }

  public onCloseOptionsPanelClick(): void {
    this.multiSelectStateService.closeOptionsPanel();
  }

  public toggleMasterCheckboxSelection(isSelected: boolean): void {
    this.masterCheckboxToggleSubject.next(isSelected);
  }
}
