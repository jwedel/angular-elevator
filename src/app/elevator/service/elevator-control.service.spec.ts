import {DoorStatus, ElevatorControlService, OperationState} from './elevator-control.service';

describe('ElevatorControlService', () => {
  let elevator: ElevatorControlService;

  beforeEach(() => {
    elevator = new ElevatorControlService(-2, 2);
  });

  it('should return levels', () => {
    expect(elevator.getLowestFloor()).toEqual(-2);
    expect(elevator.getHighestFloor()).toEqual(2);
  });

  it('should return initial floor', () => {
    expect(elevator.getCurrentLevel()).toEqual(0);
  });

  it('should return that doors are closed', () => {
    expect(elevator.getDoorStatus()).toEqual('CLOSED');
  });

  function expectElevatorState(
    expectedLevel: number = 0,
    expectedDoorState: DoorStatus = 'OPEN',
    expectedOperationStatus: OperationState = 'IDLE'): void {
    expect(elevator.getCurrentLevel()).toEqual(expectedLevel);
    expect(elevator.getDoorStatus()).toEqual(expectedDoorState);
    expect(elevator.getOperationStatus()).toEqual(expectedOperationStatus);
  }

  it('should not change floor when calling up from current floor but door should open', () => {
    elevator.requestUpFromFloor(0);
    advanceToNextChange();
    expectElevatorState(0, 'OPEN', 'IDLE');
  });

  it('should not change floor when calling down from current floor but door should open', () => {
    elevator.requestDownFromFloor(0);
    advanceToNextChange();
    expectElevatorState(0, 'OPEN', 'IDLE');
  });

  it('should go down when requesting up ride from floor below', () => {
    elevator.requestUpFromFloor(-1);

    advanceToNextChange();
    expectElevatorState(0, 'CLOSED', 'DOWN');

    advanceToNextChange();
    expectElevatorState(-1, 'CLOSED', 'IDLE');

    advanceToNextChange();
    expectElevatorState(-1, 'OPEN', 'IDLE');
  });

  it('should go down when requesting down ride from floor below', () => {
    elevator.requestDownFromFloor(-2);

    advanceToNextChange();
    expectElevatorState(0, 'CLOSED', 'DOWN');

    advanceToNextChange();
    expectElevatorState(-1, 'CLOSED', 'DOWN');

    advanceToNextChange();
    expectElevatorState(-2, 'CLOSED', 'IDLE');

    advanceToNextChange();
    expectElevatorState(-2, 'OPEN', 'IDLE');
  });

  it('should go up when requesting up ride from floor above', () => {
    elevator.requestUpFromFloor(1);

    advanceToNextChange();
    expectElevatorState(0, 'CLOSED', 'UP');

    advanceToNextChange();
    expectElevatorState(1, 'CLOSED', 'IDLE');

    advanceToNextChange();
    expectElevatorState(1, 'OPEN', 'IDLE');
  });

  it('should go up when requesting down ride from floor above', () => {
    elevator.requestDownFromFloor(1);

    advanceToNextChange();
    expectElevatorState(0, 'CLOSED', 'UP');

    advanceToNextChange();
    expectElevatorState(1, 'CLOSED', 'IDLE');

    advanceToNextChange();
    expectElevatorState(1, 'OPEN', 'IDLE');
  });

  it('should close doors when going up to another floor', () => {
    elevator.requestUpFromFloor(1);

    advanceToNextChange();
    expectElevatorState(0, 'CLOSED', 'UP');

    advanceToNextChange();
    expectElevatorState(1, 'CLOSED', 'IDLE');

    advanceToNextChange();
    expectElevatorState(1, 'OPEN', 'IDLE');

    elevator.goTo(2);

    advanceToNextChange();
    expectElevatorState(1, 'CLOSED', 'IDLE');

    advanceToNextChange();
    expectElevatorState(1, 'CLOSED', 'UP');

    advanceToNextChange();
    expectElevatorState(2, 'CLOSED', 'IDLE');

    advanceToNextChange();
    expectElevatorState(2, 'OPEN', 'IDLE');
  });

  it('should close doors when going down to another floor', () => {
    elevator.requestUpFromFloor(1);

    advanceToNextChange();
    expectElevatorState(0, 'CLOSED', 'UP');

    advanceToNextChange();
    expectElevatorState(1, 'CLOSED', 'IDLE');

    advanceToNextChange();
    expectElevatorState(1, 'OPEN', 'IDLE');

    elevator.goTo(0);

    advanceToNextChange();
    expectElevatorState(1, 'CLOSED', 'IDLE');

    advanceToNextChange();
    expectElevatorState(1, 'CLOSED', 'DOWN');

    advanceToNextChange();
    expectElevatorState(0, 'CLOSED', 'IDLE');

    advanceToNextChange();
    expectElevatorState(0, 'OPEN', 'IDLE');
  });

  it('should go up when requesting up ride two floors above', () => {
    elevator.requestUpFromFloor(2);

    advanceToNextChange();
    expectElevatorState(0, 'CLOSED', 'UP');

    advanceToNextChange();
    expectElevatorState(1, 'CLOSED', 'UP');

    advanceToNextChange();
    expectElevatorState(2, 'CLOSED', 'IDLE');

    advanceToNextChange();
    expectElevatorState(2, 'OPEN', 'IDLE');
  });

  it('should not do anything when no requests available', () => {
    elevator.nextStep();
    expectElevatorState(0, 'CLOSED', 'IDLE');
  });

  it('should go up to selected floor', () => {
    elevator.goTo(2);

    advanceToNextChange();
    expectElevatorState(0, 'CLOSED', 'UP');

    advanceToNextChange();
    expectElevatorState(1, 'CLOSED', 'UP');

    advanceToNextChange();
    expectElevatorState(2, 'CLOSED', 'IDLE');

    advanceToNextChange();
    expectElevatorState(2, 'OPEN', 'IDLE');
  });

  it('should handle requests in same direction as current ride', () => {
    elevator.goTo(2);
    elevator.requestUpFromFloor(1);

    advanceToNextChange();
    expectElevatorState(0, 'CLOSED', 'UP');

    advanceToNextChange();
    expectElevatorState(1, 'CLOSED', 'IDLE');

    advanceToNextChange();
    expectElevatorState(1, 'OPEN', 'IDLE');

    advanceToNextChange();
    expectElevatorState(1, 'CLOSED', 'UP');

    advanceToNextChange();
    expectElevatorState(2, 'CLOSED', 'IDLE');

    advanceToNextChange();
    expectElevatorState(2, 'OPEN', 'IDLE');
  });

  it('should go down to selected floor', () => {
    elevator.goTo(-2);

    advanceToNextChange();
    expectElevatorState(0, 'CLOSED', 'DOWN');

    advanceToNextChange();
    expectElevatorState(-1, 'CLOSED', 'DOWN');

    advanceToNextChange();
    expectElevatorState(-2, 'CLOSED', 'IDLE');

    advanceToNextChange();
    expectElevatorState(-2, 'OPEN', 'IDLE');
  });

  function advanceToNextChange(maxIterations: number = 5): void {
    const doorStatus = elevator.getDoorStatus();
    const currentLevel = elevator.getCurrentLevel();
    const operationStatus = elevator.getOperationStatus();
    let iteration = 0;

    while (
      elevator.getDoorStatus() === doorStatus &&
      elevator.getCurrentLevel() === currentLevel &&
      elevator.getOperationStatus() === operationStatus &&
      iteration < maxIterations
      ) {
      elevator.nextStep();
      iteration++;
    }

    expect(iteration).toBeLessThan(maxIterations);
  }
});
