import angular from 'angular';

class StatsService {
  constructor(restangular) {
    this.restangular = restangular;
  }

  putNewStats(userEmail, userStats, exerciseName) {
    return this.restangular.one('stats').customPUT({
      userEmail,
      userStats,
      exerciseName,
    });
  }
}

StatsService.$inject = ['Restangular'];

angular.module('debugapp')
  .service('StatsService', StatsService);
