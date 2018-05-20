import { IService } from 'restangular';
import { FormatTime } from '../helpers';
import { IScore } from './../../types/ladebug.types';

class ScoresService {
  constructor(private restangular: IService) {}

  public async updateScore(userId: string, exerciseId: string, stars: number): Promise<void> {
    if (userId === '-1') {
      return;
    }

    return this.restangular.one('scores', exerciseId).customPOST({
      userId,
      stars,
    });
  }

  public async getScore(userId, exerciseId): Promise<IScore> {
    if (userId === '-1') {
      return;
    }
    const response = await this.restangular.one('scores', exerciseId).customGET('', { userId });
    return JSON.parse(response.data);
  }

  public async getAllScores(userId: string): Promise<IScore[]> {
    if (!userId || userId === '-1') {
      return [];
    }
    const response = await this.restangular.one('scores').customGET('', { userId });
    return JSON.parse(response.data);
  }

  // Score is still calculated somewhat off time
  // The time is increased based on user errors.
  public calculateStars(timeTaken: number, numErrors: number, numWrongFlags: number, numWrongSubmissions: number): number {
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

export default ScoresService;
