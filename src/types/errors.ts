export class UnrecoverableError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UnrecoverableError";
  }
}

export class AssertionError extends UnrecoverableError {
  constructor(message: string) {
    super(message);
    this.name = "AssertionError";
  }
}