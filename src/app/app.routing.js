import angular from 'angular';

// Function that attaches outputId to controller
// Useful as we have this same logic three times.
function attachOutputId($state) {
  const id = $state.params.outputID || $state.params.id;
  if (!id) {
    $state.go('sandbox');
    return;
  }
  this.outputID = id;
}

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
      controller: ['$state', attachOutputId],
      controllerAs: '$ctrl',
    })
    .state('sandboxwithcode', {
      url: '/sandbox',
      params: { outputID: null },
      template: '<sandbox output-id="{{$ctrl.outputID}}"></sandbox>',
      controller: ['$state', attachOutputId],
      controllerAs: '$ctrl',
    })
    .state('debugexisting', {
      url: '/debug/:id',
      template: '<debug output-id="{{$ctrl.outputID}}"></debug>',
      controller: ['$state', attachOutputId],
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
