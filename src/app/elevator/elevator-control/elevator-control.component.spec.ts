import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ElevatorControlComponent } from './elevator-control.component';

describe('ElevatorControlComponent', () => {
  let component: ElevatorControlComponent;
  let fixture: ComponentFixture<ElevatorControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ElevatorControlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ElevatorControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
