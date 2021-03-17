import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleDrawerComponent } from './schedule-drawer.component';

describe('ScheduleDrawerComponent', () => {
  let component: ScheduleDrawerComponent;
  let fixture: ComponentFixture<ScheduleDrawerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScheduleDrawerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduleDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
