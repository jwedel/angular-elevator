import {BehaviorSubject} from 'rxjs';

export type Direction = 'UP' | 'DOWN';
export type DoorStatus = 'OPEN' | 'CLOSED';
export type OperationState = Direction | 'IDLE';

export type Request = {
  direction: Direction,
  targetLevel: number,
  originLevel?: number
};
type TaskType = 'OPEN_DOOR' | 'CLOSE_DOOR';
type MicroTask = { task: TaskType };

export class ElevatorControlService {
  private currentLevel = 0;
  private requests: Request[] = [];
  private doorStatus: DoorStatus = 'CLOSED';
  private microTaskQueue: MicroTask[] = [];
  private operationState: OperationState = 'IDLE';
  cabinRequests: BehaviorSubject<Request[]> = new BehaviorSubject<Request[]>([]);
  floorRequests: BehaviorSubject<Request[]> = new BehaviorSubject<Request[]>([]);

  constructor(
    private readonly lowestFloor: number,
    private readonly highestFloor: number) {
  }

  getHighestFloor(): number {
    return this.highestFloor;
  }

  getLowestFloor(): number {
    return this.lowestFloor;
  }

  getCurrentLevel(): number {
    return this.currentLevel;
  }

  getDoorStatus(): DoorStatus {
    return this.doorStatus;
  }

  getOperationStatus(): OperationState {
    return this.operationState;
  }

  requestUpFromFloor(level: number): void {
    this.requests.push({
      direction: 'UP',
      targetLevel: level
    });
  }

  requestDownFromFloor(level: number): void {
    this.requests.push({
      direction: 'DOWN',
      targetLevel: level
    });
  }

  private getDirectionForTargetLevel(targetLevel: number): Direction {
    return targetLevel < this.currentLevel ? 'DOWN' : 'UP';
  }

  goTo(level: number): void {
    this.requests.push({
      direction: this.getDirectionForTargetLevel(level),
      originLevel: this.getCurrentLevel(),
      targetLevel: level
    });
  }

  nextStep(): void {
    const microTask = this.microTaskQueue.shift();
    if (microTask) {
      this.handleMicroTask(microTask);
    } else {
      if (this.doorStatus === 'OPEN') {
        // Always close doors, even when idle
        this.closeDoor();
      } else {
        const nextRequest = this.requests.shift();
        if (nextRequest) {
          this.handleRequest(nextRequest);
        }
      }
    }

    this.cabinRequests.next(this.getCabinRequests());
    this.floorRequests.next(this.getFloorRequests());
  }

  private handleRequest(nextEvent: Request): void {
    switch (this.operationState) {
      case 'IDLE': {
        if (nextEvent.targetLevel !== this.currentLevel) {
          this.operationState = this.getDirectionForTargetLevel(nextEvent.targetLevel);
          this.requests.unshift(nextEvent);
        } else {
          this.openDoor();
        }
        break;
      }
      case 'DOWN': {
        this.currentLevel--;
        this.handleMoving(nextEvent);
        break;
      }
      case 'UP': {
        this.currentLevel++;
        this.handleMoving(nextEvent);
        break;
      }
    }
  }

  private handleMoving(nextEvent: Request): void {
    if (this.currentLevel === nextEvent.targetLevel) {
      this.operationState = 'IDLE';
      this.openDoor();
    } else {
      const requestToCurrentFloor = this.removePendingRequestsOnCurrentLevel();
      if (requestToCurrentFloor.length > 0) {
        this.operationState = 'IDLE';
        this.openDoor();
      }
      this.requests.unshift(nextEvent);
    }
  }

  private openDoor(): void {
    this.microTaskQueue.push({task: 'OPEN_DOOR'});
  }

  private closeDoor(): void {
    this.microTaskQueue.push({task: 'CLOSE_DOOR'});
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

  private removePendingRequestsOnCurrentLevel(): Request[] {
    const pendingOnCurrentLevel: Request[] = [];
    const rest: Request[] = [];
    this.requests.forEach(request => {
      if (request.targetLevel === this.currentLevel &&
        request.direction === this.operationState) {
        pendingOnCurrentLevel.push(request);
      } else {
        rest.push(request);
      }
    });

    this.requests = rest;

    return pendingOnCurrentLevel;
  }

  private getCabinRequests(): Request[] {
    return this.requests.filter(request => !!request.originLevel);
  }

  private getFloorRequests(): Request[] {
    return this.requests.filter(request => !request.originLevel);
  }
}
