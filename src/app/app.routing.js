import angular from 'angular';

function routing($urlRouterProvider, $stateProvider, $locationProvider) {
  $urlRouterProvider.otherwise('/');
  $locationProvider.html5Mode(true);

  $stateProvider
    .state('home', {
      url: '/',
      template: '<home></home>',
    })
    .state('debugsandbox', {
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
    .state('sandboxwithcode', {
      url: '/sandbox',
      params: { outputID: null },
      template: '<sandbox output-id="{{$ctrl.outputID}}"></sandbox>',
      controller: ['$state', function ($state) {
        if (!$state.params.outputID) {
          $state.go('sandbox');
          return;
        }
        this.outputID = $state.params.outputID;
      }],
      controllerAs: '$ctrl',
    })
    .state('debugexisting', {
      url: '/debug/:id',
      template: '<debug output-id="{{$ctrl.outputID}}"></debug>',
      controller: ['$state', function ($state) {
        if (!$state.params.id) {
          $state.go('sandbox');
          return;
        }
        this.outputID = $state.params.id;
      }],
      controllerAs: '$ctrl',
    })
    .state('addexercise', {
      url: '/add',
      template: '<edit-exercise></edit-exercise>',
    })
    .state('editexercise', {
      url: '/edit/:id',
      template: '<edit-exercise exercise-id="{{$ctrl.exerciseId}}"></edit-exercise>',
      controller: ['$state', function ($state) {
        if (!$state.params.id) {
          $state.go('admin');
          return;
        }
        this.exerciseId = $state.params.id;
      }],
      controllerAs: '$ctrl',
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

routing.$inject = ['$urlRouterProvider', '$stateProvider', '$locationProvider'];

angular.module('debugapp')
  .config(routing);
