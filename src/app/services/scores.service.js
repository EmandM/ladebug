import angular from 'angular';
import FormatTime from '../helpers/format-time.helper';

class ScoresService {
  constructor(restangular) {
    this.restangular = restangular;
  }

  updateScore(userId, exerciseId, stars) {
    if (userId === -1) {
      return false;
    }

    return this.restangular.one('scores', exerciseId).customPOST({
      userId,
      stars,
    });
  }

  getScore(userId, exerciseId) {
    if (userId === -1) {
      return false;
    }
    return this.restangular.one('scores', exerciseId).customGET('', { userId })
      .then(response => JSON.parse(response.data));
  }

  getAllScores(userId) {
    if (!userId || userId === -1) {
      return [];
    }
    return this.restangular.one('scores').customGET('', { userId })
      .then(response => JSON.parse(response.data));
  }


  // Score is still calculated somewhat off time
  // The time is increased based on user errors.
  calculateStars(timeTaken, numErrors, numWrongFlags, numWrongSubmissions) {
    // add ten seconds for every wrong flag
    const wrongFlagTime = numWrongFlags * FormatTime.unitsToMs(10, 'seconds');
    // add twenty seconds for every wrong flag
    const wrongSubmissionTime = numWrongSubmissions * FormatTime.unitsToMs(20, 'seconds');
    // average total time taken by number of error lines
    const averageTimePerErrorMs = timeTaken / numErrors;

    const score = wrongFlagTime + wrongSubmissionTime + averageTimePerErrorMs;

    // if score is too low for any stars, default one star on completion
    let numStars = 1;
    if (score <= FormatTime.unitsToMs(10, 'minutes')) {
      numStars = 2;
    }
    if (score <= FormatTime.unitsToMs(5, 'minutes')) {
      numStars = 3;
    }
    if (score <= FormatTime.unitsToMs(2, 'minutes')) {
      numStars = 4;
    }
    if (score <= FormatTime.unitsToMs(30, 'seconds')) {
      numStars = 5;
    }
    return numStars;
  }
}

ScoresService.$inject = ['Restangular'];

angular.module('debugapp')
  .service('ScoresService', ScoresService);
