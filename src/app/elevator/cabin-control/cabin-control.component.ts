import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Floor} from '../../building/building.component';
import {Request} from '../service/elevator-control.service';

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

  @Input()
  cabinRequests: Request[];

  @Output() buttonClicked = new EventEmitter<number>();

  constructor() {
  }

  ngOnInit(): void {
  }

  isCabinButtonPressed(level: number): boolean {
    return this.cabinRequests.find(request => request.targetLevel === level) !== undefined;
  }
}
