import angular from 'angular';

import template from './home.template.html';
import './home.scss';

class homeController {
  // constructor() {
  // }

}

homeController.$inject = [];

angular.module('debugapp')
  .component('home', {
    template,
    controller: homeController,
    bindings: {},
  });
