import angular from 'angular';

class StatsService {
  constructor(restangular) {
    this.restangular = restangular;

    this.averageStats = {};
    this.averageStats.incorrectGuesses = 0;
    this.averageStats.breakpointsSet = 0;
    this.averageStats.flagsSet = 0;
    this.averageStats.run = 0;
    this.averageStats.stepForward = 0;
    this.averageStats.stepBack = 0;
    this.averageStats.goToEnd = 0;
    this.averageStats.goToStart = 0;
    this.numStats = 0;
  }

  getExerciseStatsById(exerciseId) {
    return this.restangular.one('stats', exerciseId).get()
      .then((response) => {
        const output = JSON.parse(response.data);

        for (const statsObjKey in output) {
          // statsObj is each instance of a stats document stored in the db
          const statsObj = output[statsObjKey];

          // statsData is the data stored in the stats field of the current statsObj document
          const statsData = JSON.parse(statsObj.stats.replace(/'/g, '\"'));

          this.addToTotalStats(statsData);
        }

        console.log('numStats = ' + this.numStats);
        this.calculateAverageStats();
        return this.averageStats;
      });
  }

  addToTotalStats(statsData) {
    // how to do times
    this.averageStats.incorrectGuesses += statsData.incorrectGuesses;
    this.averageStats.breakpointsSet += statsData.breakpointsSet;
    this.averageStats.flagsSet += statsData.flagsSet;
    this.averageStats.run += statsData.run;
    this.averageStats.stepForward += statsData.stepForward;
    this.averageStats.stepBack += statsData.stepBack;
    this.averageStats.goToEnd += statsData.goToEnd;
    this.averageStats.goToStart += statsData.goToStart;
    this.numStats += 1;
  }

  calculateAverageStats() {
    for (let statKey in this.averageStats) {
      if (this.averageStats[statKey] !== 0) {
        this.averageStats[statKey] = Math.ceil(this.averageStats[statKey] / this.numStats);
      }
    }
  }

  putNewStats(userId, stats, exerciseId) {
    return this.restangular.one('stats').customPUT({
      userId,
      stats,
      exerciseId,
    });
  }
}

StatsService.$inject = ['Restangular'];

angular.module('debugapp')
  .service('StatsService', StatsService);
