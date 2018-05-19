import { forEach, mapValues, reduce } from 'lodash';
import * as moment from 'moment';
import { IAverageStats, IExerciseStats } from '../../types';

interface IStats {
  timeTaken: number;
  incorrectGuesses: number;
  breakpointsSet: number;
  correctFlags: number;
  incorrectFlags: number;
  run: number;
  stepForward: number;
  stepBack: number;
  goToEnd: number;
  goToStart: number;
}

export class StatsHelper {
  public static calculateAverageStats(stats: IExerciseStats[]): IAverageStats {
    if (!stats || stats.length < 0) {
      return;
    }
    const totalStats = StatsHelper.sumAllStats(stats);
    const averageStats: any = StatsHelper.averageAllStats(totalStats, stats.length);
    averageStats.timeTaken = StatsHelper.formatAsMinutes(averageStats.timeTaken);
    return averageStats;
  }

  private static sumAllStats(stats: IExerciseStats[]): IStats {
    const baseStats: IStats = {
      timeTaken: 0,
      incorrectGuesses: 0,
      breakpointsSet: 0,
      correctFlags: 0,
      incorrectFlags: 0,
      run: 0,
      stepForward: 0,
      stepBack: 0,
      goToEnd: 0,
      goToStart: 0,
    };
    let numStats = 0;
    const totalStats = reduce(stats, (count: IStats, statsData: IExerciseStats) => {
      count.timeTaken +=
        moment((statsData.endTime).slice(0, -5))
          .diff(moment((statsData.startTime).slice(0, -5)));
      numStats += 1;
      forEach(statsData, (stat, key) => {
        if (key !== 'startTime' && key !== 'endTime') {
          count[key] += statsData[key];
        }
      });
      return count;
    }, baseStats);
    return totalStats;
  }

  private static averageAllStats(totalStats: IStats, numStats: number): IStats {
    return mapValues(totalStats, (statValue, key) => {
      const result = (statValue !== 0) ? statValue / numStats : 0;
      if (key === 'time') {
        return result;
      }
      return Math.ceil(result);
    });
  }

  private static formatAsMinutes(msDuration: number): string {
    const duration = moment.utc(msDuration); // This breaks if the duration is longer than 24 hours
    return duration.format(duration.hours() ? 'h[h] m[m] ss[s]' : 'm[m] ss[s]');
  }
}
