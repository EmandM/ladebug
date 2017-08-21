import angular from 'angular';

class StatsService {
  constructor(restangular) {
    this.restangular = restangular;
  }

  putNewStats(userId, userStats, exerciseName) {
    return this.restangular.one('stats').customPUT({
      userId,
      userStats,
      exerciseName,
    });
  }
}

StatsService.$inject = ['Restangular'];

angular.module('debugapp')
  .service('StatsService', StatsService);
