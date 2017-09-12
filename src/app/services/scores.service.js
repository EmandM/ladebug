import angular from 'angular';

class ScoresService {
  constructor(restangular) {
    this.restangular = restangular;
  }

  putScore(userId, exerciseId, stars) {
    return this.restangular.one('scores').customPUT({
      userId,
      exerciseId,
      stars,
    });
  }

  getScore(userId, exerciseId) {
    return this.restangular.one('scores').one(userId).one(exerciseId).get()
      .then(response => JSON.parse(response.data));
  }

  getAllScores(userId) {
    return this.restangular.one('scores').one(userId).get()
      .then(response => JSON.parse(response.data));
  }
}

ScoresService.$inject = ['Restangular'];

angular.module('debugapp')
  .service('ScoresService', ScoresService);
