import * as angular from 'angular';
import { map } from 'lodash';

import './stars.scss';
import template from './stars.template.html';

class StarsController {
  private starsArray: boolean[];
  private score: number;

  constructor() {
    this.starsArray = new Array(5);
  }

  public $onChanges(changesObj) {
    if (changesObj.score && this.score) {
      this.updateStars(this.score);
    }
  }

  public updateStars(numStars: number) {
    this.starsArray = map(this.starsArray, (value, index) => {
      const isTrue = (index + 1) <= numStars;
      return isTrue;
    });
  }
}

StarsController.$inject = [];

angular.module('debugapp')
  .component('stars', {
    template,
    controller: StarsController,
    bindings: {
      score: '<',
      size: '@',
    },
  });
