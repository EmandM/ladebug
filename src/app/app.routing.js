import angular from 'angular';

function routing($urlRouterProvider, $stateProvider) {
  $urlRouterProvider.otherwise('/sandbox');

  $stateProvider
    .state('debug', {
      url: '/debug',
      params: { outputID: null },
      template: '<debug output-id="{{$ctrl.outputID}}"></debug>',
      controller: ['$state', function ($state) {
        if (!$state.params.outputID) {
          $state.go('sandbox');
          return;
        }
        this.outputID = $state.params.outputID;
      }],
      controllerAs: '$ctrl',
    })
    .state('exercisesList', {
      url: '/exercises-list',
      template: '<exercises-list></exercises-list>',
    })
    .state('sandbox', {
      url: '/sandbox',
      template: '<sandbox></sandbox>',
    });
}

routing.$inject = ['$urlRouterProvider', '$stateProvider'];

angular.module('debugapp')
  .config(routing);
