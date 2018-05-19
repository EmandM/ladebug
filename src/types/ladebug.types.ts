import { IPrimitive } from '.';

export interface IVariable {
  type: string;
  name?: string;
  value: IVariable | IPrimitive;
  isPrimitive: boolean;
}

export interface ICallStack {
  id: string;
  name: string;
  variables: IVariable[];
}

export interface ITestCase {
  input: string;
  expectedOutput: string;
}

export interface IExercise {
  errorLines: number[];
  name: string;
  description: string;
  codeString: string;
  entryFunction: string;
  testCases: ITestCase[];
}

export interface IPartialExercise {
  name: string;
  codeString: string;
}

export interface ICodeTrace {
  trace: any;
}

export interface ICodeOutput {
  id: string;
  debugInfo: ICodeTrace;
  error: string;
}

export interface IExerciseStats {
  startTime: string;
  endTime: string;
  incorrectGuesses: number;
  breakpointsSet: number;
  correctFlags: number;
  incorrectFlags: number;
  run: number;
  stepForward: number;
  stepBack: number;
  goToEnd: number;
  goToStart: number;
}

export interface IAverageStats {
  timeTaken?: string;
  incorrectGuesses: number;
  breakpointsSet: number;
  correctFlags: number;
  incorrectFlags: number;
  run: number;
  stepForward: number;
  stepBack: number;
  goToEnd: number;
  goToStart: number;
}
