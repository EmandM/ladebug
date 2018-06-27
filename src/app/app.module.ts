import '@uirouter/angularjs';
import * as angular from 'angular';
import 'angular-animate';
import 'angular-highlightjs';
import 'angular-material';
import 'angular-messages';
import '@uirouter/angularjs';
import 'angular-highlightjs';
import 'restangular';
import './common/ui-codemirror.directive';

import theming from './app.config';
import routing from './app.routing';

angular.module('debugapp', [
  'ngAnimate',
  'ngMaterial',
  'ngMessages',
  'ui.codemirror',
  'ui.router',
  'restangular',
  'hljs',
]).config(routing)
  .config(theming);
