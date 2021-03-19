import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuildingComponent } from './building.component';
import {MatCardModule} from '@angular/material/card';
import {MatTableModule} from '@angular/material/table';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {ElevatorComponent} from '../elevator/elevator.component';
import {CabinControlComponent} from '../elevator/cabin-control/cabin-control.component';

describe('BuildingComponent', () => {
  let component: BuildingComponent;
  let fixture: ComponentFixture<BuildingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MatCardModule,
        MatTableModule,
        MatIconModule,
        MatButtonModule
      ],
      declarations: [
        BuildingComponent,
        ElevatorComponent,
        CabinControlComponent
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuildingComponent);
    component = fixture.componentInstance;
    component.ngOnInit();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
