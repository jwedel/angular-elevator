import {Component, Input, OnInit} from '@angular/core';
import {DoorStatus} from './service/elevator-control.service';

@Component({
  selector: 'app-elevator',
  templateUrl: './elevator.component.html',
  styleUrls: ['./elevator.component.scss']
})
export class ElevatorComponent implements OnInit {

  @Input()
  doorStatus: DoorStatus;

  constructor() {
  }

  ngOnInit(): void {
  }

}
