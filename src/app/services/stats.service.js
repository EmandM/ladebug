import angular from 'angular';

class StatsService {
  constructor(restangular) {
    this.restangular = restangular;
  }

  getExerciseStatsById(exerciseId) {
    return this.restangular.one('stats', exerciseId).get()
      .then((response) => {
        const output = JSON.parse(response.data);
        // do stuff! get the stats

        return output;
      });
  }

  putNewStats(userId, userStats, exerciseId) {
    return this.restangular.one('stats').customPUT({
      userId,
      userStats,
      exerciseId,
    });
  }
}

StatsService.$inject = ['Restangular'];

angular.module('debugapp')
  .service('StatsService', StatsService);
