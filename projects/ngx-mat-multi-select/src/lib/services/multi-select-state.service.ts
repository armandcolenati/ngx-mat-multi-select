import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class NgxMultiSelectStateService implements OnDestroy {
  public optionsPanelClosed$!: Observable<void>;

  private readonly optionsPanelClosedSubject = new Subject<void>();

  constructor() {
    this.optionsPanelClosed$ = this.optionsPanelClosedSubject.asObservable();
  }

  public ngOnDestroy(): void {
    this.optionsPanelClosedSubject.complete();
  }

  public closeOptionsPanel(): void {
    this.optionsPanelClosedSubject.next();
  }
}
