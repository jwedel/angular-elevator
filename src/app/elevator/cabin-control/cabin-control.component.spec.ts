import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CabinControlComponent } from './cabin-control.component';

describe('ElevatorControlComponent', () => {
  let component: CabinControlComponent;
  let fixture: ComponentFixture<CabinControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CabinControlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CabinControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
