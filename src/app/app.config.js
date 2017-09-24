import angular from 'angular';

function theming($mdThemingProvider, restangularProvider) {
  $mdThemingProvider.theme('default')
    .primaryPalette('light-blue')
    .accentPalette('red');

  restangularProvider.setBaseUrl('https://ladebug-server.herokuapp.com/');
}

theming.$inject = ['$mdThemingProvider', 'RestangularProvider'];

angular.module('debugapp').config(theming);
