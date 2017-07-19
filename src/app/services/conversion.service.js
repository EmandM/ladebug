import angular from 'angular';

class ConversionService {
  constructor(restangular) {
    this.restangular = restangular;
  }

  postRequest(pythonString) {
    console.log('yo');
  
    //restangularr wowee
    //var code = Restangular.all('sandbox');
  }

}

ConversionService.$inject = ['Restangular'];

angular.module('debugapp')
  .service('ConversionService', ConversionService);
