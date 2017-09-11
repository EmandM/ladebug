import angular from 'angular';

class ScoreService {
  // constructor() {
  // }

  putScore(userId, exerciseId) {
    console.log(userId, exerciseId);
  }

  getScore(userId, exerciseId) {
    console.log(userId, exerciseId);
  }
}

ScoreService.$inject = [];

angular.module('debugapp')
  .service('ScoreService', ScoreService);
