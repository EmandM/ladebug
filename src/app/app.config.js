import angular from 'angular';

function theming($mdThemingProvider) {
  $mdThemingProvider.theme('default')
    .primaryPalette('lime')
    .accentPalette('grey');
}

theming.$inject = ['$mdThemingProvider'];

angular.module('debugapp').config(theming);
