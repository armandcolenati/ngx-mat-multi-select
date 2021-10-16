import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
} from '@angular/core';
import { NgxMultiSelectStateService } from '../../services/multi-select-state.service';

@Component({
  selector: 'ngx-mat-multi-select-options-header-base',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxMatMultiSelectOptionsHeaderBaseComponent {
  @Output() public readonly optionsPanelClosed = new EventEmitter<void>();

  constructor(
    private readonly multiSelectStateService: NgxMultiSelectStateService
  ) {}

  public onCloseOptionsPanelClick(): void {
    this.multiSelectStateService.closeOptionsPanel();
  }
}
