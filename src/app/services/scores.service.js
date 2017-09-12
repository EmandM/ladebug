import angular from 'angular';
import FormatTime from '../helpers/format-time.helper';

class ScoresService {
  constructor(restangular) {
    this.restangular = restangular;
  }

  updateScore(userId, exerciseId, averageTimePerErrorMs) {
    const stars = this.calculateStars(averageTimePerErrorMs);
    return this.restangular.one('scores', exerciseId).customPOST({
      userId,
      stars,
    });
  }

  getScore(userId, exerciseId) {
    return this.restangular.one('scores', exerciseId).customGET('', { userId })
      .then(response => JSON.parse(response.data));
  }

  getAllScores(userId) {
    return this.restangular.one('scores').customGET('', { userId })
      .then(response => JSON.parse(response.data));
  }

  calculateStars(averageTimePerErrorMs) {
    // if score is too low for any stars, default one star on completion
    let numStars = 1;
    if (averageTimePerErrorMs <= FormatTime.unitsToMs(10, 'minutes')) {
      numStars = 2;
    }
    if (averageTimePerErrorMs <= FormatTime.unitsToMs(5, 'minutes')) {
      numStars = 3;
    }
    if (averageTimePerErrorMs <= FormatTime.unitsToMs(2, 'minutes')) {
      numStars = 4;
    }
    if (averageTimePerErrorMs <= FormatTime.unitsToMs(30, 'seconds')) {
      numStars = 5;
    }
    return numStars;
  }
}

ScoresService.$inject = ['Restangular'];

angular.module('debugapp')
  .service('ScoresService', ScoresService);
