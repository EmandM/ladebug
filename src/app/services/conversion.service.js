import angular from 'angular';
import GuidHelper from '../helpers/guid.helper';

class ConversionService {
  constructor(restangular) {
    this.restangular = restangular;

    this.JsonResponses = {};
  }

  postRequest(pythonString) {
    return this.restangular.one('get-output').customPOST({
      codeString: pythonString
    }).then((response) => {
      const responseId = GuidHelper.createGuid();
      this.JsonResponses[responseId] = response.data;
      return {
        id: responseId,
        data: response.data,
      }
    })
    .catch((error) => {
      console.log(error);
    });
  }

  getOutputById(id) {
    return this.JsonResponses[id];
  }

}

ConversionService.$inject = ['Restangular'];

angular.module('debugapp')
  .service('ConversionService', ConversionService);
