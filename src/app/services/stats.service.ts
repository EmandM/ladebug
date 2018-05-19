import { map, replace } from 'lodash';
import { IService } from 'restangular';
import { IAverageStats, IExerciseStats } from '../../types';
import { StatsHelper } from '../helpers';

class StatsService {
  constructor(private restangular: IService) { }

  public async getExerciseStatsById(exerciseId: string): Promise<IAverageStats> {
    const response = await this.restangular.one('stats', exerciseId).get();
    const output = JSON.parse(response.data);
    const statsData: IExerciseStats[] = map(output, statsObj => JSON.parse(replace(statsObj.stats, /'/g, '"')));
    return StatsHelper.calculateAverageStats(statsData);
  }

  public async putNewStats(userId: string, stats: IExerciseStats, exerciseId: string): Promise<void> {
    await this.restangular.one('stats').customPUT({
      userId,
      stats,
      exerciseId,
    });
  }
}

StatsService.$inject = ['Restangular'];

export default StatsService;
