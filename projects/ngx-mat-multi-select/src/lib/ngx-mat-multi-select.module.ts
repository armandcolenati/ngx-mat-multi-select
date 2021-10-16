import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { BolMultiselectOptionsHeaderComponent } from './components/multi-select-options-header/multi-select-options-header.component';
import { NgxMatMultiSelectComponent } from './ngx-mat-multi-select.component';

@NgModule({
  declarations: [
    NgxMatMultiSelectComponent,
    BolMultiselectOptionsHeaderComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatSelectModule,
  ],
  exports: [NgxMatMultiSelectComponent],
})
export class NgxMatMultiSelectModule {}
