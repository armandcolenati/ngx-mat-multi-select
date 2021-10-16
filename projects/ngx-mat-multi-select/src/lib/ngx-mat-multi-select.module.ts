import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { NgxMatMultiSelectComponent } from './ngx-mat-multi-select.component';

@NgModule({
  declarations: [NgxMatMultiSelectComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
  ],
  exports: [NgxMatMultiSelectComponent],
})
export class NgxMatMultiSelectModule {}
