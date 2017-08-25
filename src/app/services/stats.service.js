import angular from 'angular';
import moment from 'moment';

class StatsService {
  constructor(restangular) {
    this.restangular = restangular;

    this.averageStats = {};
    this.averageStats.timeToCorrectlyGuessErrorLines = moment();
    this.averageStats.timeToCorrectlyEditErrorLines = moment();
    this.averageStats.incorrectGuesses = 0;
    this.averageStats.breakpointsSet = 0;
    this.averageStats.flagsSet = 0;
    this.averageStats.run = 0;
    this.averageStats.stepForward = 0;
    this.averageStats.stepBack = 0;
    this.averageStats.goToEnd = 0;
    this.averageStats.goToStart = 0;

    this.numStats = 0;
    this.averageTimeToCorrectlyGuessErrorLines = 0;
    this.averageTimeToCorrectlyEditErrorLines = 0;
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

        this.calculateAverageStats();
        this.processTimes();
        console.log('average time to correctly guess error lines = '
        + this.averageStats.timeToCorrectlyGuessErrorLines);
        console.log('average time to correctly edit error lines = '
        + this.averageStats.timeToCorrectlyEditErrorLines);
        return this.averageStats;
      });
  }

  addToTotalStats(statsData) {
    console.log('startEditTime = ' + statsData.startEditTime);
    console.log('sliced startEditTime = ' + (statsData.startEditTime).slice(0, -5));
    console.log('moment of above slice = ' + moment((statsData.startEditTime).slice(0, -5)));
    this.averageTimeToCorrectlyGuessErrorLines +=
      moment((statsData.startEditTime).slice(0, -5))
        .diff(moment((statsData.startIdentifyTime).slice(0, -5)));
    this.averageTimeToCorrectlyEditErrorLines +=
      moment((statsData.endTime).slice(0, -5))
        .diff(moment((statsData.startEditTime).slice(0, -5)));
    console.log('averageTimeToCorrectlyEditErrorLines = ' + this.averageTimeToCorrectlyEditErrorLines);
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
    this.averageTimeToCorrectlyGuessErrorLines /= this.numStats;
    this.averageTimeToCorrectlyEditErrorLines /= this.numStats;
  }

  processTimes() {
    this.averageStats.timeToCorrectlyGuessErrorLines =
      this.formatAsMinutes(this.averageTimeToCorrectlyGuessErrorLines);
    this.averageStats.timeToCorrectlyEditErrorLines =
      this.formatAsMinutes(this.averageTimeToCorrectlyEditErrorLines);

    /*
    // 0m 03s
    const guessTime = statsData.timeToCorrectlyGuessErrorLines.match(/\d/g);
    const editTime = statsData.timeToCorrectlyEditErrorLines.match(/\d/g);
    if (guessTime.length === 2) { // if hours is not included
      
    } else { // if hours is included

    }
    // nums[0] is mins
    // nums[1] is seconds
    // check if length = 3 however for hours
    */
  }

  formatAsMinutes(msDuration) {
    const duration = moment.utc(msDuration); // This breaks if the duration is longer than 24 hours
    return duration.format(duration.hours() ? 'h[h] m[m] ss[s]' : 'm[m] ss[s]');
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
