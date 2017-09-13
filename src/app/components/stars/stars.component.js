import angular from 'angular';
import map from 'lodash/map';

import template from './stars.template.html';
import './stars.scss';

class starsController {
  constructor() {
    this.starsArray = new Array(5);
  }

  $onChanges(changesObj) {
    if (changesObj.score && this.score) {
      this.updateStars(this.score);
    }
  }

  updateStars(numStars) {
    this.starsArray = map(this.starsArray, (value, index) => {
      const isTrue = (index + 1) <= numStars;
      return isTrue;
    });
  }
}

starsController.$inject = [];

angular.module('debugapp')
  .component('stars', {
    template,
    controller: starsController,
    bindings: {
      score: '<',
    },
  });
