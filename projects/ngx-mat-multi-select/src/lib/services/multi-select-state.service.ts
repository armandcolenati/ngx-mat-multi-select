import { Injectable, OnDestroy } from '@angular/core';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { NgxMultiSelectItem } from '../models/ngx-multi-select-item.model';

@Injectable()
export class NgxMultiSelectStateService<T> implements OnDestroy {
  public options$!: Observable<NgxMultiSelectItem<T>[]>;
  public optionsPanelClosed$!: Observable<void>;

  private readonly optionsSubject = new ReplaySubject<NgxMultiSelectItem<T>[]>(1);
  private readonly optionsPanelClosedSubject = new Subject<void>();

  constructor() {
    this.options$ = this.optionsSubject.asObservable();
    this.optionsPanelClosed$ = this.optionsPanelClosedSubject.asObservable();
  }

  public ngOnDestroy(): void {
    this.optionsSubject.complete();
    this.optionsPanelClosedSubject.complete();
  }

  public closeOptionsPanel(): void {
    this.optionsPanelClosedSubject.next();
  }

  public setOptions(options: NgxMultiSelectItem<T>[]): void {
    this.optionsSubject.next(options);
  }
}
