import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxMatMultiSelectComponent } from './ngx-mat-multi-select.component';

describe('NgxMatMultiSelectComponent', () => {
  let component: NgxMatMultiSelectComponent<any>;
  let fixture: ComponentFixture<NgxMatMultiSelectComponent<any>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NgxMatMultiSelectComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxMatMultiSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
