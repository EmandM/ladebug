import angular from 'angular';

function theming($mdThemingProvider, restangularProvider) {
  $mdThemingProvider.theme('default')
    .primaryPalette('light-blue')
    .accentPalette('red');

  restangularProvider.setBaseUrl('http://127.0.0.1:5000');
}

theming.$inject = ['$mdThemingProvider', 'RestangularProvider'];

angular.module('debugapp').config(theming);
