import angular from 'angular';

function theming($mdThemingProvider) {
  $mdThemingProvider.theme('default')
    .primaryPalette('light-blue')
    .accentPalette('blue-grey');
}

theming.$inject = ['$mdThemingProvider'];

angular.module('debugapp').config(theming);
