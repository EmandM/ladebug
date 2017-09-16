import moment from 'moment';
import forEach from 'lodash/forEach';

export default class FormatTime {
  static msToHumanReadable(msDuration) {
    const duration = moment.duration(msDuration);
    let output = '';
    const timeUnits = ['day', 'hour', 'minute', 'second'];

    forEach(timeUnits, (unit) => {
      const time = duration[unit + 's']();
      if (time > 0) {
        output += ` ${time} ${(time === 1) ? unit : unit + 's'}`;
      }
    });
    return output;
  }

  static pluralise(num, string) {
    return (num === 1) ? string : string + 's';
  }

  static unitsToMs(num, units) {
    return moment.duration(num, units).asMilliseconds();
  }
}
