import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { NgxMultiSelectItem } from 'projects/ngx-mat-multi-select/src/lib/models/ngx-multi-select-item.model';
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit, OnDestroy {
  public optionIndex = 0;

  public options$!: Observable<NgxMultiSelectItem<string>[]>;

  public readonly multiSelectControl = new FormControl();

  private readonly optionsSubject = new BehaviorSubject<
    NgxMultiSelectItem<string>[]
  >([]);

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
}
