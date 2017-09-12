import angular from 'angular';

class ScoresService {
  constructor(restangular) {
    this.restangular = restangular;
  }

  putScore(userId, exerciseId, averageTimePerErrorMs) {
    const stars = this.calculateStars(averageTimePerErrorMs);
    return this.restangular.one('scores', exerciseId).customPUT({
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
    if (averageTimePerErrorMs <= 240000) { // 7 minutes
      numStars = 2;
    }
    if (averageTimePerErrorMs <= 180000) { // 5 minutes
      numStars = 3;
    }
    if (averageTimePerErrorMs <= 120000) { // 3 minutes
      numStars = 4;
    }
    if (averageTimePerErrorMs <= 60000) { // 1 minute
      numStars = 5;
    }
    return numStars;
  }
}

ScoresService.$inject = ['Restangular'];

angular.module('debugapp')
  .service('ScoresService', ScoresService);
