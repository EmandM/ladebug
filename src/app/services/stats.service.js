import angular from 'angular';
import moment from 'moment';
import forEach from 'lodash/forEach';
import replace from 'lodash/replace';
import some from 'lodash/some';
import isString from 'lodash/isString';

class StatsService {
  constructor(restangular) {
    this.restangular = restangular;

    this.averageStats = {};
    this.averageStats.timeTaken = moment();
  }

  getExerciseStatsById(exerciseId) {
    this.resetAverageStats();
    return this.restangular.one('stats', exerciseId).get()
      .then((response) => {
        const output = JSON.parse(response.data);

        if (some(output)) {
          forEach(output, (statsObj) => {
            if (isString(statsObj)) {
              statsObj = JSON.parse(replace(statsObj.stats, /'/g, '"'));
            }
            this.addToTotalStats(statsData);
          });

          this.calculateAverageStats();
          this.averageStats.timeTaken = this.formatAsMinutes(this.averageTimeTaken);
          return this.averageStats;
        }
        return false;
      });
  }

  addToTotalStats(statsData) {
    this.averageTimeTaken +=
      moment((statsData.endTime).slice(0, -5))
        .diff(moment((statsData.startTime).slice(0, -5)));
    this.averageStats.incorrectGuesses += statsData.incorrectGuesses;
    this.averageStats.breakpointsSet += statsData.breakpointsSet;
    this.averageStats.correctFlags += statsData.correctFlags;
    this.averageStats.incorrectFlags += statsData.incorrectFlags;
    this.averageStats.run += statsData.run;
    this.averageStats.stepForward += statsData.stepForward;
    this.averageStats.stepBack += statsData.stepBack;
    this.averageStats.goToEnd += statsData.goToEnd;
    this.averageStats.goToStart += statsData.goToStart;
    this.numStats += 1;
  }

  calculateAverageStats() {
    forEach(this.averageStats, (statKey) => {
      if (this.averageStats[statKey] !== 0) {
        this.averageStats[statKey] = Math.ceil(this.averageStats[statKey] / this.numStats);
      }
    });
    this.averageTimeTaken /= this.numStats;
  }

  formatAsMinutes(msDuration) {
    const duration = moment.utc(msDuration); // This breaks if the duration is longer than 24 hours
    return duration.format(duration.hours() ? 'h[h] m[m] ss[s]' : 'm[m] ss[s]');
  }

  putNewStats(userId, stats, exerciseId) {
    stats = JSON.stringify(stats);
    return this.restangular.one('stats').customPUT({
      userId,
      stats,
      exerciseId,
    });
  }

  resetAverageStats() {
    this.averageStats.incorrectGuesses = 0;
    this.averageStats.breakpointsSet = 0;
    this.averageStats.correctFlags = 0;
    this.averageStats.incorrectFlags = 0;
    this.averageStats.run = 0;
    this.averageStats.stepForward = 0;
    this.averageStats.stepBack = 0;
    this.averageStats.goToEnd = 0;
    this.averageStats.goToStart = 0;

    this.numStats = 0;
    this.averageTimeTaken = 0;
  }
}

StatsService.$inject = ['Restangular'];

angular.module('debugapp')
  .service('StatsService', StatsService);
