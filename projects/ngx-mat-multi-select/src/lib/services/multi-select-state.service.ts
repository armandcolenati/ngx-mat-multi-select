import { Injectable, OnDestroy } from '@angular/core';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { NgxMultiSelectItem } from '../models/ngx-multi-select-item.model';
import { NgxMultiSelectLabels } from '../models/ngx-multi-select-labels.model';

@Injectable()
export class NgxMultiSelectStateService<T> implements OnDestroy {
  public labels$!: Observable<NgxMultiSelectLabels>;
  public options$!: Observable<NgxMultiSelectItem<T>[]>;
  public optionsPanelClosed$!: Observable<void>;

  private readonly labelsSubject = new ReplaySubject<NgxMultiSelectLabels>(1);
  private readonly optionsSubject = new ReplaySubject<NgxMultiSelectItem<T>[]>(1);
  private readonly optionsPanelClosedSubject = new Subject<void>();

  constructor() {
    this.labels$ = this.labelsSubject.asObservable();
    this.options$ = this.optionsSubject.asObservable();
    this.optionsPanelClosed$ = this.optionsPanelClosedSubject.asObservable();
  }

  public ngOnDestroy(): void {
    this.labelsSubject.complete();
    this.optionsSubject.complete();
    this.optionsPanelClosedSubject.complete();
  }

  public closeOptionsPanel(): void {
    this.optionsPanelClosedSubject.next();
  }

  public setLabels(labels: NgxMultiSelectLabels): void {
    this.labelsSubject.next(labels);
  }

  public setOptions(options: NgxMultiSelectItem<T>[]): void {
    this.optionsSubject.next(options);
  }
}
