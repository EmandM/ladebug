import angular from 'angular';
import template from './home.template.html';
import './home.scss';

class homeController {
  constructor() {
    this.title = 'Hello World'
  }
}

homeController.$inject = [];

angular.module('debugapp')
  .component('home', {
    template,
    controller: homeController,
    bindings: {},
  });
