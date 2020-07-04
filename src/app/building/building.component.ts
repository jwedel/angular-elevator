import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {ElevatorControlService} from '../elevator/service/elevator-control.service';
import {Observable, interval, Subscription} from 'rxjs';

export interface Floor {
  level: number;
}

@Component({
  selector: 'app-building',
  templateUrl: './building.component.html',
  styleUrls: ['./building.component.scss']
})
export class BuildingComponent implements OnInit, OnDestroy {

  @Input()
  lowestFloor: number;

  @Input()
  highestFloor: number;

  elevatorControl: ElevatorControlService;
  displayedColumns: string[] = ['name', 'buttons', 'elevator'];

  private timerSubscription: Subscription;
  floors: Floor[] = [];

  constructor() {
  }

  getLevels(): number {
    return (this.highestFloor - this.lowestFloor) + 1;
  }

  ngOnInit(): void {
    this.elevatorControl = new ElevatorControlService(this.lowestFloor, this.highestFloor);
    this.timerSubscription = interval(1000).subscribe(() => this.elevatorControl.nextStep());
    this.floors = this.buildFloors();
  }

  ngOnDestroy(): void {
    this.timerSubscription.unsubscribe();
  }

  private buildFloors(): Floor[] {
    const floors: Floor[] = [];
    for (let i = this.highestFloor; i >= this.lowestFloor; i--) {
      floors.push({level: i});
    }
    return floors;
  }
}
