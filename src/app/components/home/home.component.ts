import angular from 'angular';

import './home.scss';
import template from './home.template.html';

class HomeController {
  // constructor() {
  // }

}

HomeController.$inject = [];

angular.module('debugapp')
  .component('home', {
    template,
    controller: HomeController,
    bindings: {},
  });
