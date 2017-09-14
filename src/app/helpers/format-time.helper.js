import moment from 'moment';

export default class FormatTime {
  static msToHumanReadable(msDuration) {
    const duration = moment.utc(msDuration); // This breaks if the duration is longer than 24 hours
    const seconds = duration.seconds();
    const minutes = duration.minutes();
    const hours = duration.hours();
    const secondString = `${seconds} ${FormatTime.pluralise(seconds, 'second')} `;
    const minuteString = `${minutes} ${FormatTime.pluralise(minutes, 'minute')} `;
    const hourString = `${hours} ${FormatTime.pluralise(hours, 'hour')} `;

    return hours ? hourString + minuteString + secondString : minuteString + secondString;
  }

  static pluralise(num, string) {
    return (num === 1) ? string : string + 's';
  }

  static unitsToMs(num, units) {
    return moment.duration(num, units).asMilliseconds();
  }
}
