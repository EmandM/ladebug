import angular from 'angular';
import 'angular-animate';
import 'angular-material';
import 'angular-messages';
import 'angular-ui-router';
import 'angular-highlightjs';
import 'restangular';
import './common/ui-codemirror.directive';

angular.module('debugapp', [
  'ngAnimate',
  'ngMaterial',
  'ngMessages',
  'ui.codemirror',
  'ui.router',
  'restangular',
  'hljs',
]);
