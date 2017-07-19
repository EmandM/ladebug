import angular from 'angular';

class ConversionService {
  constructor(restangular) {
    this.restangular = restangular;
  }

  postRequest(codeInput) {
    if (codeInput) {
      this.restangular.one('get-output').customPOST({codestring: codeInput}).then((response) => { console.log(response); });
    } else {
      //create a modal saying something? or make button click have no action
      console.log('No code entered');
    }
  }

}

ConversionService.$inject = ['Restangular'];

angular.module('debugapp')
  .service('ConversionService', ConversionService);
