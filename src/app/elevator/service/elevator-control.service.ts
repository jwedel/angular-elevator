export type Direction = 'UP' | 'DOWN';
export type DoorStatus = 'OPEN' | 'CLOSED';
export type OperationState = Direction | 'IDLE';

type Request = {
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
        if (this.currentLevel === nextEvent.targetLevel) {
          this.operationState = 'IDLE';
          this.openDoor();
        } else {
          this.requests.unshift(nextEvent);
        }
        break;
      }
      case 'UP': {
        this.currentLevel++;
        if (this.currentLevel === nextEvent.targetLevel) {
          this.operationState = 'IDLE';
          this.microTaskQueue.push({task: 'OPEN_DOOR'});
        } else {
          this.requests.unshift(nextEvent);
        }
        break;
      }
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
}
