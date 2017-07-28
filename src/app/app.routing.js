import angular from 'angular';

function routing($urlRouterProvider, $stateProvider) {
  $urlRouterProvider.otherwise('/');

  $stateProvider
    .state('home', {
      url: '/',
      template: '<exercises-list></exercises-list>',
    })
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
    .state('editexercise', {
      url: '/edit',
      template: '<edit-exercise></edit-exercise>',
    })
    .state('admin', {
      url: '/admin',
      template: '<admin></admin>',
    })
    .state('sandbox', {
      url: '/sandbox',
      template: '<sandbox></sandbox>',
    });
}

routing.$inject = ['$urlRouterProvider', '$stateProvider'];

angular.module('debugapp')
  .config(routing);
