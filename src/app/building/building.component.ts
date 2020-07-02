import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {ElevatorControlService} from '../elevator/service/elevator-control.service';
import {Observable, interval, Subscription} from 'rxjs';

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
  private timerSubscription: Subscription;

  constructor() {
    this.timerSubscription = interval(1000).subscribe(() => this.elevatorControl.nextStep());
  }

  getLevels(): number {
    return (this.highestFloor - this.lowestFloor) + 1;
  }

  ngOnInit(): void {
    this.elevatorControl = new ElevatorControlService(this.lowestFloor, this.highestFloor);
  }

  ngOnDestroy(): void {
    this.timerSubscription.unsubscribe();
  }

}
