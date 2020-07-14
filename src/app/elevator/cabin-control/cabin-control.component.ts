import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Floor} from '../../building/building.component';

@Component({
  selector: 'app-cabin-control',
  templateUrl: './cabin-control.component.html',
  styleUrls: ['./cabin-control.component.scss']
})
export class CabinControlComponent implements OnInit {

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
