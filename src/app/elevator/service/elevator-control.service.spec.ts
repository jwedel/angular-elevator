import {DoorStatus, ElevatorControlService, OperationState} from './elevator-control.service';

describe('ElevatorControlService', () => {
  let elevator: ElevatorControlService;

  beforeEach(() => {
    elevator = new ElevatorControlService(-2, 2);
  });

  describe('Initial State', () => {

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
  });

  describe('Elevator Movement', () => {

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

      expectElevatorStateSequence([
        [0, 'CLOSED', 'DOWN'],
        [-1, 'CLOSED', 'IDLE'],
        [-1, 'OPEN', 'IDLE']
      ]);
    });

    it('should go down when requesting down ride from floor below', () => {
      elevator.requestDownFromFloor(-2);

      expectElevatorStateSequence([
        [0, 'CLOSED', 'DOWN'],
        [-1, 'CLOSED', 'DOWN'],
        [-2, 'CLOSED', 'IDLE'],
        [-2, 'OPEN', 'IDLE']
      ]);
    });

    it('should go up when requesting up ride from floor above', () => {
      elevator.requestUpFromFloor(1);

      expectElevatorStateSequence([
        [0, 'CLOSED', 'UP'],
        [1, 'CLOSED', 'IDLE'],
        [1, 'OPEN', 'IDLE']
      ]);
    });

    it('should go up when requesting down ride from floor above', () => {
      elevator.requestDownFromFloor(1);

      expectElevatorStateSequence([
        [0, 'CLOSED', 'UP'],
        [1, 'CLOSED', 'IDLE'],
        [1, 'OPEN', 'IDLE']
      ]);
    });

    it('should close doors when going up to another floor', () => {
      elevator.requestUpFromFloor(1);

      expectElevatorStateSequence([
        [0, 'CLOSED', 'UP'],
        [1, 'CLOSED', 'IDLE'],
        [1, 'OPEN', 'IDLE']
      ]);

      elevator.goTo(2);

      expectElevatorStateSequence([
        [1, 'CLOSED', 'IDLE'],
        [1, 'CLOSED', 'UP'],
        [2, 'CLOSED', 'IDLE'],
        [2, 'OPEN', 'IDLE']
      ]);
    });

    it('should close doors when going down to another floor', () => {
      elevator.requestUpFromFloor(1);

      expectElevatorStateSequence([
        [0, 'CLOSED', 'UP'],
        [1, 'CLOSED', 'IDLE'],
        [1, 'OPEN', 'IDLE']
      ]);

      elevator.goTo(0);

      expectElevatorStateSequence([
        [1, 'CLOSED', 'IDLE'],
        [1, 'CLOSED', 'DOWN'],
        [0, 'CLOSED', 'IDLE'],
        [0, 'OPEN', 'IDLE']
      ]);
    });

    it('should go up when requesting up ride two floors above', () => {
      elevator.requestUpFromFloor(2);

      expectElevatorStateSequence([
        [0, 'CLOSED', 'UP'],
        [1, 'CLOSED', 'UP'],
        [2, 'CLOSED', 'IDLE'],
        [2, 'OPEN', 'IDLE']
      ]);
    });

    it('should not do anything when no requests available', () => {
      elevator.nextStep();
      expectElevatorState(0, 'CLOSED', 'IDLE');
    });

    it('should go up to selected floor', () => {
      elevator.goTo(2);

      expectElevatorStateSequence([
        [0, 'CLOSED', 'UP'],
        [1, 'CLOSED', 'UP'],
        [2, 'CLOSED', 'IDLE'],
        [2, 'OPEN', 'IDLE']
      ]);
    });

    it('should handle up floor requests in same direction as current ride', () => {
      elevator.goTo(2);
      elevator.requestUpFromFloor(1);

      expectElevatorStateSequence([
        [0, 'CLOSED', 'UP'],
        [1, 'CLOSED', 'IDLE'],
        [1, 'OPEN', 'IDLE'],
        [1, 'CLOSED', 'IDLE'],
        [1, 'CLOSED', 'UP'],
        [2, 'CLOSED', 'IDLE'],
        [2, 'OPEN', 'IDLE']
      ]);
    });

    it('should handle down floor requests in same direction as current ride', () => {
      elevator.goTo(-2);
      elevator.requestDownFromFloor(-1);

      expectElevatorStateSequence([
        [0, 'CLOSED', 'DOWN'],
        [-1, 'CLOSED', 'IDLE'],
        [-1, 'OPEN', 'IDLE'],
        [-1, 'CLOSED', 'IDLE'],
        [-1, 'CLOSED', 'DOWN'],
        [-2, 'CLOSED', 'IDLE'],
        [-2, 'OPEN', 'IDLE']
      ]);
    });

    it('should not handle floor requests in other direction as current ride', () => {
      elevator.goTo(2);
      elevator.requestDownFromFloor(1);

      expectElevatorStateSequence([
        [0, 'CLOSED', 'UP'],
        [1, 'CLOSED', 'UP'],
        [2, 'CLOSED', 'IDLE'],
        [2, 'OPEN', 'IDLE']
      ]);
    });

    it('should handle elevator requests in same direction as current ride', () => {
      elevator.goTo(2);
      elevator.goTo(1);

      expectElevatorStateSequence([
        [0, 'CLOSED', 'UP'],
        [1, 'CLOSED', 'IDLE'],
        [1, 'OPEN', 'IDLE'],
        [1, 'CLOSED', 'IDLE'],
        [1, 'CLOSED', 'UP'],
        [2, 'CLOSED', 'IDLE'],
        [2, 'OPEN', 'IDLE']
      ]);
    });

    it('should go down to selected floor', () => {
      elevator.goTo(-2);

      expectElevatorStateSequence([
        [0, 'CLOSED', 'DOWN'],
        [-1, 'CLOSED', 'DOWN'],
        [-2, 'CLOSED', 'IDLE'],
        [-2, 'OPEN', 'IDLE']
      ]);
    });

    it('should go down for request after going up and opening at target floor', () => {
      elevator.goTo(2);
      elevator.requestDownFromFloor(1);

      expectElevatorStateSequence([
        [0, 'CLOSED', 'UP'],
        [1, 'CLOSED', 'UP'],
        [2, 'CLOSED', 'IDLE'],
        [2, 'OPEN', 'IDLE'],
        [2, 'CLOSED', 'IDLE'],
        [2, 'CLOSED', 'DOWN'],
        [1, 'CLOSED', 'IDLE'],
        [1, 'OPEN', 'IDLE'],
        [1, 'CLOSED', 'IDLE']
      ]);
    });
  });

  describe('Requests', () => {
    describe('Cabin Requests', () => {
      it('should not have any cabin requests initially', () => {
        let cabinRequests;
        elevator.cabinRequests.subscribe(requests => cabinRequests = requests);

        expect(cabinRequests).toEqual([]);
      });

      it('should have target floor when going up', () => {
        let cabinRequests;
        elevator.cabinRequests.subscribe(requests => cabinRequests = requests);

        elevator.goTo(4);
        elevator.nextStep();

        expect(cabinRequests).toEqual([{direction: 'UP', targetLevel: 4, originLevel: 0}]);
      });
    });

    describe('Floor Requests', () => {
      it('should not have any cabin requests initially', () => {
        let floorRequests;
        elevator.floorRequests.subscribe(requests => floorRequests = requests);

        expect(floorRequests).toEqual([]);
      });
    });
  });

  function expectElevatorStateSequence(expectedStates: (number | DoorStatus | OperationState)[][]): void {
    for (const expectedState of expectedStates) {
      const [expectedLevel, expectedDoorState, expectedOperationStatus] = expectedState;
      advanceToNextChange();
      expectElevatorState(expectedLevel as number,
        expectedDoorState as DoorStatus,
        expectedOperationStatus as OperationState);
    }
  }

  function expectElevatorState(
    expectedLevel: number = 0,
    expectedDoorState: DoorStatus = 'OPEN',
    expectedOperationStatus: OperationState = 'IDLE'): void {
    expect(elevator.getCurrentLevel()).toEqual(expectedLevel);
    expect(elevator.getDoorStatus()).toEqual(expectedDoorState);
    expect(elevator.getOperationStatus()).toEqual(expectedOperationStatus);
  }

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
