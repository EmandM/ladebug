import angular from 'angular';
import GuidHelper from '../helpers/guid.helper';

class ExerciseService {
  constructor(restangular, $q) {
    this.restangular = restangular;
    this.$q = $q;

    this.JsonResponses = {};
  }

  postRequest(pythonString) {
    if (!pythonString) {
      return;
    }
    return this.restangular.one('get-output').customPOST({
      codeString: pythonString
    }).then((response) => {
      const responseId = GuidHelper.createGuid();
      const cachedOutput = {
        id: responseId,
        debugInfo: JSON.parse(response.data),
      }
      this.JsonResponses[responseId] = cachedOutput;
      return cachedOutput;
    })
    .catch((error) => {
      console.log(error);
    });
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
        this.JsonResponses[id] = output;
        return output;
      });
  }

  getAllExercises() {
    return this.restangular.one('exercises-list').get()
      .then(response => JSON.parse(response.data));
  }

  createExercise(name, codeString, errorLine) {
    return this.restangular.one('exercise').customPUT({
      name,
      codeString,
      errorLine,
    })
  }

  updateExercise(id, name, codeString, errorLine) {
    delete this.JsonResponses[id];
    return this.restangular.one('exercise', id).customPOST({
      name,
      codeString,
      errorLine,
    })
  }

}

ExerciseService.$inject = ['Restangular', '$q'];

angular.module('debugapp')
  .service('ExerciseService', ExerciseService);
