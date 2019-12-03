export const MMMM = ['January','February','March','April','May','June',
'July','August','September','October','November','December'];

export const dddd = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
export const ddd = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
export const dd = ['Su','Mo','Tu','We','Th','Fr','Sa'];
export const d = ['S','M','T','W','T','F','S'];
const dayFormatTypes = { dddd, ddd, dd, d };

/*
- getMonth
- getYear
- daysInMonth - number of days in the month.
- weekday - get the day of the week that the date is on.
format
subtract (day, month etc)
add (day, month etc)
isSame - day, month or year is the same.
isBefore - is before the minDate
isAfter - is after the max date.
isToday
*/

/**
 * @param {Date} date
 * @returns {Number}
 */
export function getYear(date) {
  return new Date(date).getFullYear();
}

/**
 * @param {Number} month - NOT 0 indexed. 1 = January, 12 = December.
 * @param {Number} year
 * @returns {Number}
 */
export function daysInMonth (month, year) {
  return new Date(year, month + 1, 0).getDate();
}

/**
 * @param {Date} date - Date to subtract from.
 * @param {Number} number - Number or days/weeks/months/years to subtract.
 * @param {String} denomination - days, weeks, months, or years.
 * @returns {Date}
 */
export function subtract(date, number, denomination) {
  let daysToSubtract = 0;
  switch (denomination) {
  case 'days':
    daysToSubtract = number;
    break;
  case 'weeks':
    daysToSubtract = number * 7;
    break;
  case 'months':
    daysToSubtract = daysInMonth(date.getMonth(), date.getFullYear()) * number;
    break;
  case 'years':
    daysToSubtract = ((number * 7) * 4) * 12;
    break;
  default:
    break;
  }

  const dateToSubtract = new Date(date);
  dateToSubtract.setDate(dateToSubtract.getDate() - daysToSubtract);
  return new Date(dateToSubtract);
}

/**
 * @param {Date} date
 * @returns {Object} - { MM: 0, MMMM: 'January' } - 0 indexed - January is 0, December is 11.
 */
export function getMonth(date) {
  const month = new Date(date).getMonth();
  return {
    MM: new Date(date).getMonth(),
    MMMM: MMMM[month],
  }
}

/**
 * @param {Date} date
 * @returns {Number} - Sunday - Saturday: 0 - 6
 */
export function getDayInWeek(date) {
  const weekday = new Date(date).getDay();
  return {
    d: weekday,
    dd: dayFormatTypes.dd[weekday],
    ddd: dayFormatTypes.ddd[weekday],
    dddd: dayFormatTypes.dddd[weekday],
  };
}

/**
 * @param {string} date
 * @param {string} format - one of 'MM/DD/YYYY', 'MM-DD-YYYY', 'DD/MM/YYYY', 'DD-MM-YYYY', 'YYYY/MM/DD', 'YYYY-MM-DD'.
 * @returns {String[]}
 */
export function resetFormat(date, format) {
  if (!date || !format) return null;
  // Work out what the delimiter is, either '-' or '/'.
  const delimiter = format.split('-').length > 1 ? '-' : '/';
  if (!delimiter) return null;

  // Split the format and the date.
  const splitFormat = format.split(delimiter);
  const splitDate = date.split(delimiter);
  if ((!splitFormat || splitFormat.length === 1) || (!splitDate || splitDate.length === 1)) return null;

  const resetDate = {};
  splitFormat.forEach((part, index) => {
    switch (part) {
      case 'MM':
        resetDate.month = parseInt(splitDate[index]);
        break;
      case 'DD':
        resetDate.date = parseInt(splitDate[index]);
        break;
      case 'YYYY':
        resetDate.year = parseInt(splitDate[index]);
        break;
      default:
        break;
    }
  });
  return [resetDate.year, resetDate.month, resetDate.date];
}
