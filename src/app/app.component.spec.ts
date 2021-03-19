import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import {BuildingComponent} from './building/building.component';
import {MatCardModule} from '@angular/material/card';
import {MatTableModule} from '@angular/material/table';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {ElevatorComponent} from './elevator/elevator.component';
import {CabinControlComponent} from './elevator/cabin-control/cabin-control.component';

describe('AppComponent', () => {
  let fixture;
  let app;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        MatCardModule,
        MatTableModule,
        MatButtonModule,
        MatIconModule
      ],
      declarations: [
        AppComponent,
        BuildingComponent,
        ElevatorComponent,
        CabinControlComponent
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    app = fixture.componentInstance;
    fixture.detectChanges();

  });

  it('should create the app', () => {
    expect(app).toBeTruthy();
  });

  it(`should have as title 'elevator'`, () => {
    expect(app.title).toEqual('elevator');
  });
});
