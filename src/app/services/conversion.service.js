import angular from 'angular';

class ConversionService {
  constructor(restangular) {
    this.restangular = restangular;
  }
}

ConversionService.$inject = ['Restangular'];

angular.module('debugapp')
  .service('ConversionService', ConversionService);

/*
  1) send python string to service
  2) service makes POST request to server with python string for below work
  3) - server converts python to json
     - server returns json to service
  4) service makes unique id for json created
  5) sandbox page changes to debug page, sending json id to debug page through
     param (app.routing.js)
  6) debug page sends json id to service asking for corresponding json
  7) service returns corresponding json to debug page
*/
