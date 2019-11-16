import moment from 'moment';

export function getDayInWeek({ year, month, date }) {
  return moment([year, month, date]).weekday();
}

export function getFullDate({ year, month, date }) {
  return moment([year, month, date]);
}
