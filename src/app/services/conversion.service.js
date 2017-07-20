import angular from 'angular';
import GuidHelper from '../helpers/guid.helper';

class ConversionService {
  constructor(restangular, $q) {
    this.restangular = restangular;
    this.$q = $q;

    this.JsonResponses = {};
  }

  postRequest(pythonString) {
    if (pythonString) {
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
  }

  getOutputById(id) {
    //return (id in this.JsonResponses) ? this.$q.when(this.JsonResponses[id]) : false //send request to server for retrieval from database!
    
    //this.$q.when() is a promise

    return this.JsonResponses[id];
  }

}

ConversionService.$inject = ['Restangular', '$q'];

angular.module('debugapp')
  .service('ConversionService', ConversionService);
