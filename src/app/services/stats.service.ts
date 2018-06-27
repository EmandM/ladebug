import { map, replace, isString } from 'lodash';
import { IService } from 'restangular';
import { IAverageStats, IExerciseStats } from '../../types';
import { StatsHelper } from '../helpers';

class StatsService {
  constructor(private restangular: IService) { }

  public async getExerciseStatsById(exerciseId: string): Promise<IAverageStats> {
    const response = await this.restangular.one('stats', exerciseId).get();
    const output = JSON.parse(response.data);
    const statsData: IExerciseStats[] = map(output, (statsObj) => {
      if (isString(statsObj)) {
        return JSON.parse(replace(statsObj.stats, /'/g, '"'));
      }
      return statsObj;
    });
    return StatsHelper.calculateAverageStats(statsData);
  }

  public async putNewStats(userId: string, statsObj: IExerciseStats, exerciseId: string): Promise<void> {
    const stats = JSON.stringify(statsObj);
    await this.restangular.one('stats').customPUT({
      userId,
      stats,
      exerciseId,
    });
  }
}

StatsService.$inject = ['Restangular'];

export default StatsService;
