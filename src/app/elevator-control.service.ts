import {Injectable} from '@angular/core';

type Direction = 'UP' | 'DOWN';
export type DoorStatus = 'OPEN' | 'CLOSED';
type Request = { direction: Direction, targetLevel: number };
type TaskType = 'OPEN_DOOR' | 'CLOSE_DOOR';
type MicroTask = { task: TaskType };

@Injectable({
  providedIn: 'root'
})
export class ElevatorControlService {
  private currentLevel: number;
  private requests: Request[] = [];
  private doorStatus: DoorStatus;
  private microQueue: MicroTask[] = [];

  constructor(private readonly levels: number) {
    this.currentLevel = 0;
    this.doorStatus = 'CLOSED';
  }

  getLevels(): number {
    return this.levels;
  }

  getCurrentLevel(): number {
    return this.currentLevel;
  }

  getDoorStatus(): DoorStatus {
    return this.doorStatus;
  }

  requestUpFromFloor(level: number): void {
    this.requests.push({direction: 'UP', targetLevel: level});
  }

  requestDownFromFloor(level: number): void {
    this.requests.push({direction: 'DOWN', targetLevel: level});
  }

  goTo(level: number): void {
    if (level > this.getCurrentLevel()) {
      this.requests.push({direction: 'UP', targetLevel: level});
    } else if (level < this.getCurrentLevel()) {
      this.requests.push({direction: 'DOWN', targetLevel: level});
    }
  }

  nextStep(): void {
    const microTask = this.microQueue.shift();
    if (microTask) {
      this.handleMicroTask(microTask);
    } else {
      const nextRequest = this.requests.shift();
      if (nextRequest) {
        this.handleRequest(nextRequest);
      }
    }
  }

  private handleRequest(nextEvent: Request): void {
    if (this.doorStatus === 'OPEN') {
      this.microQueue.push({task: 'CLOSE_DOOR'});
      this.requests.unshift(nextEvent);
      return;
    }

    switch (nextEvent.direction) {
      case 'UP':
        if (this.currentLevel < nextEvent.targetLevel) {
          this.currentLevel++;
          this.requests.unshift(nextEvent);
        } else {
          this.microQueue.push({task: 'OPEN_DOOR'});
        }
        break;
      case 'DOWN':
        if (this.currentLevel > nextEvent.targetLevel) {
          this.currentLevel--;
          this.requests.unshift(nextEvent);
        } else {
          this.microQueue.push({task: 'OPEN_DOOR'});
        }
        break;
    }
  }

  private handleMicroTask(microTask): void {
    switch (microTask.task) {
      case 'OPEN_DOOR': {
        this.doorStatus = 'OPEN';
        break;
      }
      case 'CLOSE_DOOR': {
        this.doorStatus = 'CLOSED';
        break;
      }
    }
  }
}
