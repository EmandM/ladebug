import angular from 'angular';

class ScoreService {
  constructor() {
  }

  putScore(userId, exerciseId) {
    // call flask
  }

  getScore(userId, exerciseId) {
    // call flask
  }
}

ScoreService.$inject = [];

angular.module('debugapp')
  .service('ScoreService', ScoreService);
