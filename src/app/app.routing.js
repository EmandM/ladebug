import angular from 'angular';

function routing($urlRouterProvider, $stateProvider) {
  $urlRouterProvider.otherwise('/');

  $stateProvider
    .state('home', {
      url: '/',
      template: '<home></home>',
    });
}

routing.$inject = ['$urlRouterProvider', '$stateProvider'];

angular.module('debugapp')
  .config(routing);
