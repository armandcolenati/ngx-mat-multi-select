import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { NgxMultiSelectItem } from 'projects/ngx-mat-multi-select/src/lib/models/ngx-multi-select-item.model';
import { BehaviorSubject, Observable } from 'rxjs';

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
  {
    label: 'Option 3',
    value: 'option-3',
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

  public options$!: Observable<NgxMultiSelectItem<string>[]>;

  public readonly multiSelectControl = new FormControl();

  private readonly optionsSubject = new BehaviorSubject<
    NgxMultiSelectItem<string>[]
  >(DEFAULT_OPTIONS);

  public ngOnInit(): void {
    this.options$ = this.optionsSubject.asObservable();
  }

  public ngOnDestroy(): void {
    this.optionsSubject.complete();
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

  public onForceSelectionClick(): void {
    this.multiSelectControl.setValue([DEFAULT_OPTIONS[1].value]);
  }
}
