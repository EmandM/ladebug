import { clone, find, map } from 'lodash';
import { IService } from 'restangular';
import { ICodeOutput, IExercise, IFrame, IPartialExercise, ITestCase } from '../../types';
import { GuidHelper } from '../helpers';

class ExerciseService {
  private jsonResponses: { [id: string]: ICodeOutput | (ICodeOutput & IExercise) } = {};
  private filesUploaded: { [id: string]: IPartialExercise} = {};
  private exerciseList: IExercise[];

  public constructor(private restangular: IService) { }

  public async runSandbox(pythonString: string, entryFunction?: string,
    testCases?: ITestCase[], outputId?: string): Promise<ICodeOutput> {
    const testCaseJson = JSON.stringify(testCases);
    const response = await this.restangular.one('get-output').customPOST({
      codeString: pythonString,
      entryFunction,
      testCases: testCaseJson,
    });

    const debugInfo = JSON.parse(response.data);
    const cachedOutput = {
      id: outputId || GuidHelper.createGuid(),
      debugInfo,
      error: this.getErrorMessage(debugInfo.trace),
    };
    this.jsonResponses[cachedOutput.id] = cachedOutput;
    return cachedOutput;
  }

  public getErrorMessage(codeTrace: IFrame[]): string {
    const errorTrace = find(codeTrace, 'exception_msg');
    return (errorTrace) ? errorTrace.exception_msg : undefined;
  }

  public async getOutputById(id: string): Promise<ICodeOutput | (ICodeOutput & IExercise)> {
    if (!(id in this.jsonResponses)) {
      return this.getExerciseById(id);
    }
    return this.jsonResponses[id];
  }

  public async deleteExercise(id: string): Promise<void> {
    this.clearExerciseListCache();
    await this.restangular.one('exercise', id).remove();
  }

  public async getAllExercises(): Promise<IExercise[]> {
    if (!this.exerciseList) {
      await this.loadExerciseList();
    }
    return this.exerciseList;
  }

  public async loadExerciseList(): Promise<void> {
    const response = await this.restangular.one('exercises-list').get();
    this.exerciseList = JSON.parse(response.data);
  }

  // Format data for sending to server
  public getExerciseObj(data: IExercise): any {
    const obj: any = clone(data);
    obj.errorLines = JSON.stringify(data.errorLines);
    obj.testCases = JSON.stringify(data.testCases);
    return obj;
  }

  public async createExercise(data: IExercise): Promise<void> {
    this.clearExerciseListCache();
    await this.restangular.one('exercise').customPUT(this.getExerciseObj(data));
  }

  public async updateExercise(id: string, data: IExercise): Promise<void> {
    this.clearExerciseListCache();
    this.clearExerciseOutputCache(id);
    await this.restangular.one('exercise', id).customPOST(this.getExerciseObj(data));
  }

  public async validateTests(tests: ITestCase[]) {
    const testCases = map(tests, testCase => ({
      input: testCase.input,
      expected_output: testCase.expectedOutput,
    }));

    const response = await this.restangular.one('validate-tests').customPOST({ testCases: JSON.stringify(testCases) });
    if (response.valid) {
      return JSON.parse(response.data);
    }
    throw ({ invalidTypes: true, message: response.error });
  }

  public softCreateExercise(name: string, codeString: string): string {
    const id = GuidHelper.createGuid();
    this.filesUploaded[id] = {
      name,
      codeString,
    };
    return id;
  }

  public getSoftCreate(id: string): IPartialExercise {
    return this.filesUploaded[id];
  }

  public clearExerciseListCache(): void {
    delete this.exerciseList;
  }

  public clearExerciseOutputCache(exerciseId: string): void {
    delete this.jsonResponses[exerciseId];
  }

  private async getExerciseById(id: string): Promise<(ICodeOutput & IExercise)> {
    const output = {} as (ICodeOutput & IExercise);
    let response = await this.restangular.one('exercise', id).get();
    response = JSON.parse(response.data);

    // Parse debugInfo as it is saved in the server as a string
    output.codeString = response.code_string;
    output.name = response.name;
    output.errorLines = response.errorLines;
    output.description = response.description;
    output.entryFunction = response.entry_function;
    output.testCases = map(JSON.parse(response.test_cases), testCase => ({
      input: testCase.input,
      expectedOutput: testCase.expected_output,
    }));

    if (response.bug_lines) {
      output.errorLines = JSON.parse(response.bug_lines);
    }
    const sandboxOutput = await this.runSandbox(response.code_string, response.entry_function, response.testCases, id);
    output.debugInfo = sandboxOutput.debugInfo;
    this.jsonResponses[id] = output;
    return output;
  }
}

ExerciseService.$inject = ['Restangular'];

export default ExerciseService;
