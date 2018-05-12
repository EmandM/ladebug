import * as angular from 'angular';
import 'angular-animate';
import 'angular-material';
import 'angular-messages';
import 'angular-highlightjs';
import 'restangular';
import '@uirouter/angularjs'
import './common/ui-codemirror.directive';

import routing from './app.routing';

angular.module('debugapp', [
  'ngAnimate',
  'ngMaterial',
  'ngMessages',
  'ui.codemirror',
  'ui.router',
  'restangular',
  'hljs',
]).config(routing);
