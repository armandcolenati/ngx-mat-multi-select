import { FocusMonitor } from '@angular/cdk/a11y';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
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
import { Observable, Subject, Subscription } from 'rxjs';
import { startWith } from 'rxjs/operators';
import { NgxMultiSelectItem } from './models/ngx-multi-select-item.model';
import { NgxMultiSelectLabels } from './models/ngx-multi-select-labels.model';
import { NgxMultiSelectStateService } from './services/multi-select-state.service';
import { observeProperty } from './utils/observe-property';

const OVERLAY_PANEL_Y_OFFSET = 30;

@Component({
  selector: 'ngx-mat-multi-select',
  templateUrl: './ngx-mat-multi-select.component.html',
  styleUrls: ['./ngx-mat-multi-select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: MatFormFieldControl,
      useExisting: NgxMatMultiSelectComponent,
    },
    NgxMultiSelectStateService,
  ],
})
export class NgxMatMultiSelectComponent<T> implements ControlValueAccessor, MatFormFieldControl<T[]>, OnInit, AfterViewInit, OnDestroy {
  @Input() public get disabled(): boolean {
    return this._disabled;
  }
  public set disabled(value: boolean) {
    this._disabled = coerceBooleanProperty(value);

    if (this._disabled) {
      this.multiSelectControl.disable();
    } else {
      this.multiSelectControl.enable();
    }

    this.stateChangesSubject.next();
  }

  @Input() public set labels(labels: NgxMultiSelectLabels | null) {
    if (labels) {
      this.multiSelectStateService.setLabels(labels);
    }
  }

  @Input() public set options(options: NgxMultiSelectItem<T>[] | null) {
    if (options) {
      this.multiSelectStateService.setOptions(options);
    }
  }

  @Input() public get placeholder(): string {
    return this._placeholder;
  }
  public set placeholder(value: string) {
    this._placeholder = value;
    this.stateChangesSubject.next();
  }

  @Input() public get required(): boolean {
    return this._required;
  }
  public set required(value: boolean) {
    this._required = coerceBooleanProperty(value);
    this.stateChangesSubject.next();
  }

  public get focused(): boolean {
    return this._focused || this.isPanelOpened;
  }
  public set focused(focus: boolean) {
    this._focused = focus;
    this.stateChangesSubject.next();
  }

  public static nextId = 0;

  @ViewChild('matSelect') public readonly matSelectRef!: MatSelect;

  @HostBinding() public readonly id = `ngx-mat-multi-select-${NgxMatMultiSelectComponent.nextId++}`;

  public touched = false;
  public value: T[] = [];

  public stateChanges!: Observable<void>;
  public options$!: Observable<NgxMultiSelectItem<T>[]>;

  public readonly multiSelectControl = new FormControl();

  public get empty() {
    return !this.multiSelectControl.value?.length;
  }

  public get errorState(): boolean {
    return this.multiSelectControl.invalid && this.touched;
  }

  public get shouldLabelFloat() {
    return this.focused || !this.empty;
  }

  private _disabled = false;
  private _focused = false;
  private _placeholder = '';
  private _required = false;
  private isPanelOpened = false;

  private readonly stateChangesSubject = new Subject<void>();

  private readonly subscriptions = new Subscription();

  constructor(
    private readonly focusMonitor: FocusMonitor,
    private readonly elementRef: ElementRef,
    private readonly multiSelectStateService: NgxMultiSelectStateService<T>,
    @Optional() @Self() public ngControl: NgControl
  ) {
    if (this.ngControl) {
      // Setting the value accessor directly (instead of using the providers) to avoid running into a circular import.
      this.ngControl.valueAccessor = this;
    }

    this.subscriptions.add(
      this.focusMonitor.monitor(this.elementRef.nativeElement, true).subscribe((origin) => {
        if (!this.disabled && !(origin === 'mouse' || origin === 'touch')) {
          this.focused = !!origin;
        }
      })
    );
  }

  public ngOnInit(): void {
    this.stateChanges = this.stateChangesSubject.asObservable();
    this.options$ = this.multiSelectStateService.options$;

    const combinedSubscriptions = [this._syncSelectionOnOptionsUpdate(), this._closeOptionsPanelListener()];

    combinedSubscriptions.forEach((subscription) => this.subscriptions.add(subscription));
  }

  public ngAfterViewInit(): void {
    // Make sure that the overlay panel is always positioned directly below the form field. Angular Material does some weird automatic
    // positioning that we wish to override. see https://github.com/angular/components/issues/14105
    this.subscriptions.add(
      observeProperty(this.matSelectRef, '_offsetY').subscribe((offsetY) => {
        if (offsetY !== OVERLAY_PANEL_Y_OFFSET) {
          this.matSelectRef._offsetY = OVERLAY_PANEL_Y_OFFSET;
        }
      })
    );
  }

  public ngOnDestroy(): void {
    this.focusMonitor.stopMonitoring(this.elementRef.nativeElement);

    this.stateChangesSubject.complete();

    this.subscriptions.unsubscribe();
  }

  public onTouched = () => {};

  public setDescribedByIds(): void {}

  public onContainerClick(): void {
    if (!this.disabled) {
      this.matSelectRef.open();
    }
  }

  public onSelectPanelToggle(isOpened: boolean): void {
    this.isPanelOpened = isOpened;

    if (isOpened) {
      this.matSelectRef.focus();
      this.focused = true;
    } else {
      this.matSelectRef._onBlur();
    }
  }

  public registerOnChange(onChange: (value: T[]) => void): void {
    this.subscriptions.add(
      this.multiSelectControl.valueChanges.pipe(startWith(this.multiSelectControl.value)).subscribe((value) => onChange(value))
    );
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

  private _closeOptionsPanelListener(): Subscription {
    return this.multiSelectStateService.optionsPanelClosed$.subscribe(() => this.matSelectRef.close());
  }

  private _syncSelectionOnOptionsUpdate(): Subscription {
    return this.multiSelectStateService.options$.subscribe((options) => {
      const checkedOptions = options.filter((option) => option.checked).map((option) => option.value);
      this.multiSelectControl.setValue(checkedOptions);
    });
  }
}
