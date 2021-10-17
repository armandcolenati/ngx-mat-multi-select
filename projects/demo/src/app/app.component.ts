import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NgxMultiSelectItem } from 'projects/ngx-mat-multi-select/src/lib/models/ngx-multi-select-item.model';
import { NgxMultiSelectLabels } from 'projects/ngx-mat-multi-select/src/lib/models/ngx-multi-select-labels.model';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';

const DEFAULT_LABELS: NgxMultiSelectLabels = {
  title: 'Options',
};

const DEFAULT_OPTIONS: NgxMultiSelectItem<string>[] = [
  {
    label: 'Option 1',
    value: 'option-1',
    checked: true,
  },
  {
    label: 'Option 2',
    value: 'option-2',
    checked: true,
  },
];

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit, OnDestroy {
  public optionIndex = DEFAULT_OPTIONS.length;

  public labels$!: Observable<NgxMultiSelectLabels>;
  public options$!: Observable<NgxMultiSelectItem<string>[]>;

  public readonly multiSelectControl = new FormControl();
  public readonly disableMultiSelectControl = new FormControl(false);

  private readonly labelsSubject = new BehaviorSubject<NgxMultiSelectLabels>(DEFAULT_LABELS);
  private readonly optionsSubject = new BehaviorSubject<NgxMultiSelectItem<string>[]>(DEFAULT_OPTIONS);

  private readonly subscriptions = new Subscription();

  public ngOnInit(): void {
    this.labels$ = this.labelsSubject.asObservable();
    this.options$ = this.optionsSubject.asObservable();

    this.subscriptions.add(
      this.disableMultiSelectControl.valueChanges.subscribe((disableControl) =>
        disableControl ? this.multiSelectControl.disable() : this.multiSelectControl.enable()
      )
    );
  }

  public ngOnDestroy(): void {
    this.labelsSubject.complete();
    this.optionsSubject.complete();

    this.subscriptions.unsubscribe();
  }

  public onAddOptionClick(checked: boolean): void {
    this.optionIndex++;

    this.optionsSubject.next([
      ...this.optionsSubject.getValue(),
      {
        label: `Option ${this.optionIndex}`,
        value: `option-${this.optionIndex}`,
        checked,
      },
    ]);
  }

  public onClearOptionsClick(): void {
    this.optionsSubject.next([]);
  }

  public onForceSelectionClick(): void {
    this.multiSelectControl.setValue([DEFAULT_OPTIONS[1].value]);
  }
}
