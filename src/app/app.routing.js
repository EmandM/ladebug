import angular from 'angular';

function routing($urlRouterProvider, $stateProvider) {
  $urlRouterProvider.otherwise('/sandbox');

  $stateProvider
    .state('debug', {
      url: '/debug',
      //params: { outputID: -1 }
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
