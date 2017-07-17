import angular from 'angular';

function routing($urlRouterProvider, $stateProvider) {
  $urlRouterProvider.otherwise('/sandbox');

  $stateProvider
    .state('debug', {
      url: '/debug',
      template: '<debug></debug>',
    })
    .state('sandbox', {
      url: '/sandbox',
      template: '<sandbox></sandbox>',
    });
}

routing.$inject = ['$urlRouterProvider', '$stateProvider'];

angular.module('debugapp')
  .config(routing);
