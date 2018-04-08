import * as moment from 'moment';
import { unitOfTime } from 'moment';
import { forEach } from 'lodash';

export default class FormatTime {
  static msToHumanReadable(msDuration: number): string {
    const duration = moment.duration(msDuration);
    let output = '';
    const timeUnits = ['day', 'hour', 'minute', 'second'];

    forEach(timeUnits, (unit) => {
      // moment.duration().minutes() gives the number of minutes in a duration between 0 and 59.
      // .days(), .hours() and .seconds() all work the same way.
      const time = duration[unit + 's']();

      // If there are more than 0 units in a time
      if (time > 0) {
        // add the time, plus the unit name pluralised.
        output += ` ${time} ${(time === 1) ? unit : unit + 's'}`;
      }
    });
    return output;
  }

  static pluralise(num: number, string: string): string {
    return (num === 1) ? string : string + 's';
  }

  static unitsToMs(num: number, units: unitOfTime.DurationConstructor): number {
    return moment.duration(num, units).asMilliseconds();
  }
}
