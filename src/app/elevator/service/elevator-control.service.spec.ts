import {DoorStatus, ElevatorControlService} from './elevator-control.service';

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

  function expectElevatorState(expectedLevel: number = 0, expectedDoorState: DoorStatus = 'OPEN'): void {
    expect(elevator.getCurrentLevel()).toEqual(expectedLevel);
    expect(elevator.getDoorStatus()).toEqual(expectedDoorState);
  }

  it('should not change floor when calling up from current floor but door should open', () => {
    elevator.requestUpFromFloor(0);
    advanceToNextChange();
    expectElevatorState();
  });

  it('should not change floor when calling down from current floor but door should open', () => {
    elevator.requestDownFromFloor(0);
    advanceToNextChange();
    expectElevatorState(0, 'OPEN');
  });

  it('should go down when calling from floor below', () => {
    elevator.requestDownFromFloor(-1);

    advanceToNextChange();
    expectElevatorState(-1, 'CLOSED');

    advanceToNextChange();
    expectElevatorState(-1, 'OPEN');
  });

  it('should go down when calling from floor below', () => {
    elevator.requestDownFromFloor(-2);
    advanceToNextChange();
    expectElevatorState(-1, 'CLOSED');

    advanceToNextChange();
    expectElevatorState(-2, 'CLOSED');

    advanceToNextChange();
    expectElevatorState(-2, 'OPEN');
  });

  it('should go up when requesting from floor above', () => {
    elevator.requestUpFromFloor(1);

    advanceToNextChange();
    expectElevatorState(1, 'CLOSED');

    advanceToNextChange();
    expectElevatorState(1, 'OPEN');
  });

  it('should close doors when going up to another floor', () => {
    elevator.requestUpFromFloor(1);

    advanceToNextChange();
    expectElevatorState(1, 'CLOSED');

    advanceToNextChange();
    expectElevatorState(1, 'OPEN');

    elevator.goTo(2);

    advanceToNextChange();
    expectElevatorState(1, 'CLOSED');

    advanceToNextChange();
    expectElevatorState(2, 'CLOSED');

    advanceToNextChange();
    expectElevatorState(2, 'OPEN');
  });

  it('should close doors when going down to another floor', () => {
    elevator.requestUpFromFloor(1);

    advanceToNextChange();
    expectElevatorState(1, 'CLOSED');

    advanceToNextChange();
    expectElevatorState(1, 'OPEN');

    elevator.goTo(0);

    advanceToNextChange();
    expectElevatorState(1, 'CLOSED');

    advanceToNextChange();
    expectElevatorState(0, 'CLOSED');

    advanceToNextChange();
    expectElevatorState(0, 'OPEN');
  });

  it('should go up when requesting two floors above', () => {
    elevator.requestUpFromFloor(2);

    advanceToNextChange();
    expectElevatorState(1, 'CLOSED');

    advanceToNextChange();
    expectElevatorState(2, 'CLOSED');

    advanceToNextChange();
    expectElevatorState(2, 'OPEN');
  });

  it('should not do anything when not requests', () => {
    elevator.nextStep();
    expectElevatorState(0, 'CLOSED');
  });

  it('should go to selected floor', () => {
    elevator.goTo(2);

    advanceToNextChange();
    expectElevatorState(1, 'CLOSED');

    advanceToNextChange();
    expectElevatorState(2, 'CLOSED');

    advanceToNextChange();
    expectElevatorState(2, 'OPEN');
  });

  it('should go to selected floor', () => {
    elevator.goTo(-2);

    advanceToNextChange();
    expectElevatorState(-1, 'CLOSED');

    advanceToNextChange();
    expectElevatorState(-2, 'CLOSED');

    advanceToNextChange();
    expectElevatorState(-2, 'OPEN');
  });

  it('should pick up when requested in between', () => {
  });

  function advanceToNextChange(maxIterations: number = 5): void {
    const doorStatus = elevator.getDoorStatus();
    const currentLevel = elevator.getCurrentLevel();
    let iteration = 0;

    while (
      elevator.getDoorStatus() === doorStatus &&
      elevator.getCurrentLevel() === currentLevel &&
      iteration < maxIterations
      ) {
      elevator.nextStep();
      iteration++;
    }

    expect(iteration).toBeLessThan(maxIterations);
  }
});
