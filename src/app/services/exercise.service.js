import angular from 'angular';
import find from 'lodash/find';
import GuidHelper from '../helpers/guid.helper';

class ExerciseService {
  constructor(restangular, $q) {
    this.restangular = restangular;
    this.$q = $q;

    this.JsonResponses = {};
    this.filesUploaded = {};
    this.exerciseList = undefined;
  }

  runSandbox(pythonString) {
    return this.restangular.one('get-output').customPOST({
      codeString: pythonString,
    }).then((response) => {
      const responseId = GuidHelper.createGuid();
      const cachedOutput = {
        id: responseId,
        debugInfo: JSON.parse(response.data),
      };
      cachedOutput.error = this.getErrorMessage(cachedOutput.debugInfo.trace);
      this.JsonResponses[responseId] = cachedOutput;
      return cachedOutput;
    });
  }

  getErrorMessage(codeTrace) {
    const errorTrace = find(codeTrace, 'exception_msg');
    return (errorTrace) ? errorTrace.exception_msg : undefined;
  }

  getOutputById(id) {
    return (id in this.JsonResponses) ?
      this.$q.when(this.JsonResponses[id]) :
      this.getExerciseById(id);
  }

  getExerciseById(id) {
    return this.restangular.one('exercise', id).get()
      .then((response) => {
        const output = JSON.parse(response.data);

        // Parse debugInfo as it is saved in the server as a string
        output.debugInfo = JSON.parse(output.debug_info);
        if (output.bug_lines) {
          output.errorLines = JSON.parse(output.bug_lines);
        } else if (output.bug_line) {
          output.errorLines = [output.bug_line];
        }
        this.JsonResponses[id] = output;
        return output;
      });
  }

  deleteExercise(id) {
    this.clearExerciseListCache();
    return this.restangular.one('exercise', id).remove()
      .then((response) => {
        console.log(response);
      });
  }

  getAllExercises() {
    return (this.exerciseList) ?
      this.$q.when(this.exerciseList) :
      this.restangular.one('exercises-list').get()
        .then((response) => {
          this.exerciseList = JSON.parse(response.data);
          return this.exerciseList;
        });
  }

  // Format data for sending to server
  getExerciseObj(data) {
    const bugLines = `[${data.errorLines.toString()}]`;
    return {
      name: data.name,
      description: data.description,
      codeString: data.codeString,
      errorLines: bugLines,
    };
  }

  createExercise(data) {
    this.clearExerciseListCache();
    return this.restangular.one('exercise').customPUT(this.getExerciseObj(data))
      .then(this.parseDebugInfo);
  }

  updateExercise(id, data) {
    this.clearExerciseListCache();
    this.clearExerciseOutputCache(id);
    return this.restangular.one('exercise', id).customPOST(this.getExerciseObj(data))
      .then(this.parseDebugInfo);
  }

  softCreateExercise(name, codeString) {
    const id = GuidHelper.createGuid();
    this.filesUploaded[id] = {
      name,
      codeString,
    };
    return id;
  }

  getSoftCreate(id) {
    return this.filesUploaded[id];
  }

  parseDebugInfo(response) {
    response.debugInfo = JSON.parse(response.debugInfo);
    return response;
  }

  clearExerciseListCache() {
    delete this.exerciseList;
  }

  clearExerciseOutputCache(exerciseId) {
    delete this.JsonResponses[exerciseId];
  }
}

ExerciseService.$inject = ['Restangular', '$q'];

angular.module('debugapp')
  .service('ExerciseService', ExerciseService);
