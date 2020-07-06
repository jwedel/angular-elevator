import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Floor} from '../../building/building.component';

@Component({
  selector: 'app-elevator-control',
  templateUrl: './elevator-control.component.html',
  styleUrls: ['./elevator-control.component.scss']
})
export class ElevatorControlComponent implements OnInit {

  @Input()
  currentFloor: number;

  @Input()
  floors: Floor[];

  @Output() buttonClicked = new EventEmitter<number>();

  constructor() {
  }

  ngOnInit(): void {
  }

}
