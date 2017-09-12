import moment from 'moment';

export default class FormatTime {
  static msToHumanReadable(msDuration) {
    const duration = moment.utc(msDuration); // This breaks if the duration is longer than 24 hours
    return duration.format(duration.hours() ? 'h[h] m[m] ss[s]' : 'm[m] ss[s]');
  }

  static unitsToMs(num, units) {
    return moment.duration(num, units).asMilliseconds();
  }
}
