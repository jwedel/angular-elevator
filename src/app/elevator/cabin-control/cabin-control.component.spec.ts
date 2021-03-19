import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CabinControlComponent } from './cabin-control.component';
import {MatCardModule} from "@angular/material/card";
import {MatButtonModule} from "@angular/material/button";

describe('ElevatorControlComponent', () => {
  let component: CabinControlComponent;
  let fixture: ComponentFixture<CabinControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MatCardModule,
        MatButtonModule
      ],
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
