import { coerceBooleanProperty } from '@angular/cdk/coercion';
import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  Self,
  ViewChild,
} from '@angular/core';
import { ControlValueAccessor, FormControl, NgControl } from '@angular/forms';
import { MatFormFieldControl } from '@angular/material/form-field';
import { MatSelect } from '@angular/material/select';
import { Observable, ReplaySubject, Subject, Subscription } from 'rxjs';
import { NgxMultiSelectItem } from './models/ngx-multi-select-item.model';

@Component({
  selector: 'ngx-mat-multi-select',
  templateUrl: 'ngx-mat-multi-select.component.html',
  styleUrls: ['ngx-mat-multi-select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: MatFormFieldControl,
      useExisting: NgxMatMultiSelectComponent,
    },
  ],
})
export class NgxMatMultiSelectComponent<T>
  implements
    ControlValueAccessor,
    MatFormFieldControl<NgxMultiSelectItem<T>[]>,
    OnInit,
    OnDestroy
{
  @Input()
  public get disabled(): boolean {
    return this._disabled;
  }
  public set disabled(value: boolean) {
    this._disabled = coerceBooleanProperty(value);
    this.stateChangesSubject.next();
  }
  private _disabled = false;

  @Input()
  public set options(options: NgxMultiSelectItem<T>[] | null) {
    if (options) {
      this.optionsSubject.next(options);
    }
  }

  @Input()
  public get placeholder(): string {
    return this._placeholder;
  }
  public set placeholder(value: string) {
    this._placeholder = value;
    this.stateChangesSubject.next();
  }
  private _placeholder = '';

  @Input()
  public get required(): boolean {
    return this._required;
  }
  public set required(value: boolean) {
    this._required = coerceBooleanProperty(value);
    this.stateChangesSubject.next();
  }
  private _required = false;

  public static nextId = 0;

  public value: NgxMultiSelectItem<T>[] = [];

  public get focused(): boolean {
    return this._focused;
  }
  public set focused(focus: boolean) {
    this._focused = focus;
    this.stateChangesSubject.next();
  }
  private _focused = false;

  public touched = false;

  public onChange = () => {};
  public onTouched = () => {};

  public get empty() {
    return !this.multiSelectControl.value?.length;
  }

  public get errorState(): boolean {
    return this.multiSelectControl.invalid && this.touched;
  }

  public get shouldLabelFloat() {
    return this.focused || !this.empty;
  }

  public readonly multiSelectControl = new FormControl();

  public stateChanges!: Observable<void>;
  public options$!: Observable<NgxMultiSelectItem<T>[]>;

  @ViewChild('matSelect') public readonly matSelectRef!: MatSelect;

  @HostBinding()
  public readonly id = `ngx-mat-multi-select-${NgxMatMultiSelectComponent.nextId++}`;

  private readonly optionsSubject = new ReplaySubject<NgxMultiSelectItem<T>[]>(
    1
  );
  private readonly stateChangesSubject = new Subject<void>();

  private readonly subscriptions = new Subscription();

  constructor(@Optional() @Self() public ngControl: NgControl) {
    if (this.ngControl) {
      // Setting the value accessor directly (instead of using the providers) to avoid running into a circular import.
      this.ngControl.valueAccessor = this;
    }
  }

  public ngOnInit(): void {
    this.stateChanges = this.stateChangesSubject.asObservable();
    this.options$ = this.optionsSubject.asObservable();

    this.subscriptions.add(this._syncSelectionOnOptionsUpdate());
  }

  public ngOnDestroy(): void {
    this.optionsSubject.complete();
    this.stateChangesSubject.complete();

    this.subscriptions.unsubscribe();
  }

  setDescribedByIds(ids: string[]): void {}

  public onContainerClick(): void {
    this.matSelectRef.open();
  }

  public onSelectPanelToggle(isOpened: boolean): void {
    this.focused = isOpened;
  }

  public registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  public writeValue(value: T[]): void {
    if (value) {
      this.multiSelectControl.setValue(value);
    }
  }

  private _syncSelectionOnOptionsUpdate(): Subscription {
    return this.optionsSubject.subscribe((options) => {
      const checkedOptions = options
        .filter((option) => option.checked)
        .map((option) => option.value);
      this.multiSelectControl.setValue(checkedOptions);
    });
  }
}