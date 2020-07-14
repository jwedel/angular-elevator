import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Direction, ElevatorControlService, Request} from '../elevator/service/elevator-control.service';
import {interval, Subscription} from 'rxjs';

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
  private floorRequestsSubscription: Subscription;
  private floorRequests: Request[] = [];
  floors: Floor[] = [];

  constructor() {
  }

  ngOnInit(): void {
    this.elevatorControl = new ElevatorControlService(this.lowestFloor, this.highestFloor);
    this.timerSubscription = interval(1000).subscribe(() => this.elevatorControl.nextStep());
    this.floorRequestsSubscription = this.elevatorControl.floorRequests
      .subscribe(requests => this.floorRequests = requests);
    this.floors = this.buildFloors();
  }

  ngOnDestroy(): void {
    this.timerSubscription.unsubscribe();
    this.floorRequestsSubscription.unsubscribe();
  }

  private buildFloors(): Floor[] {
    const floors: Floor[] = [];
    for (let i = this.highestFloor; i >= this.lowestFloor; i--) {
      floors.push({level: i});
    }
    return floors;
  }

  onButtonClick($event: number): void {
    this.elevatorControl.goTo($event);
  }

  isFloorButtonPressed(level: number, direction: Direction): boolean {
    return this.floorRequests.find(request => {
      return request.direction === direction && request.targetLevel === level;
    }) !== undefined;
  }
}
