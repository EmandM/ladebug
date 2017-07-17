import angular from 'angular';

class ShellService {
  constructor(restangular) {
    this.restangular = restangular;
  }
}

ShellService.$inject = ['Restangular'];

angular.module('debugapp')
  .service('ShellService', ShellService);