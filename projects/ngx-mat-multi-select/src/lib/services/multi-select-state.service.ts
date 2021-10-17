import { Injectable, OnDestroy } from '@angular/core';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { NgxMultiSelectItem } from '../models/ngx-multi-select-item.model';
import { NgxMultiSelectLabels } from '../models/ngx-multi-select-labels.model';

@Injectable()
export class NgxMultiSelectStateService<T> implements OnDestroy {
  public forcedSelectionToggle$!: Observable<T[]>;
  public labels$!: Observable<NgxMultiSelectLabels>;
  public options$!: Observable<NgxMultiSelectItem<T>[]>;
  public optionsPanelClosed$!: Observable<void>;
  public selectedValues$!: Observable<T[]>;

  private readonly forcedSelectionToggleSubject = new Subject<T[]>();
  private readonly labelsSubject = new ReplaySubject<NgxMultiSelectLabels>(1);
  private readonly optionsSubject = new ReplaySubject<NgxMultiSelectItem<T>[]>(1);
  private readonly optionsPanelClosedSubject = new Subject<void>();
  private readonly selectedValuesSubject = new ReplaySubject<T[]>();

  constructor() {
    this.forcedSelectionToggle$ = this.forcedSelectionToggleSubject.asObservable();
    this.labels$ = this.labelsSubject.asObservable();
    this.options$ = this.optionsSubject.asObservable();
    this.optionsPanelClosed$ = this.optionsPanelClosedSubject.asObservable();
    this.selectedValues$ = this.selectedValuesSubject.asObservable();
  }

  public ngOnDestroy(): void {
    this.forcedSelectionToggleSubject.complete();
    this.labelsSubject.complete();
    this.optionsSubject.complete();
    this.optionsPanelClosedSubject.complete();
    this.selectedValuesSubject.complete();
  }

  public closeOptionsPanel(): void {
    this.optionsPanelClosedSubject.next();
  }

  public toggleForcedSelection(selection: T[]): void {
    this.forcedSelectionToggleSubject.next(selection);
  }

  public setLabels(labels: NgxMultiSelectLabels): void {
    this.labelsSubject.next(labels);
  }

  public setOptions(options: NgxMultiSelectItem<T>[]): void {
    this.optionsSubject.next(options);
  }

  public setSelectedValue(options: T[]): void {
    this.selectedValuesSubject.next(options);
  }
}
