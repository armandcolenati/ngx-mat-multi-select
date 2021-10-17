import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { NgxMatMultiSelectOptionsHeaderBaseComponent } from './components/multi-select-options-header/multi-select-options-header.base.component';
import { NgxMatMultiSelectOptionsHeaderComponent } from './components/multi-select-options-header/multi-select-options-header.component';
import { NgxMatMultiSelectComponent } from './ngx-mat-multi-select.component';

@NgModule({
  declarations: [NgxMatMultiSelectComponent, NgxMatMultiSelectOptionsHeaderBaseComponent, NgxMatMultiSelectOptionsHeaderComponent],
  imports: [CommonModule, ReactiveFormsModule, MatButtonModule, MatCheckboxModule, MatFormFieldModule, MatIconModule, MatSelectModule],
  exports: [NgxMatMultiSelectComponent, NgxMatMultiSelectOptionsHeaderComponent],
})
export class NgxMatMultiSelectModule {}
