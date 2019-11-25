export const monthNames = [ "January","February","March","April","May","June",
"July","August","September","October","November","December" ];
export const monthNamesShort = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];

export const dayNames = [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" ];
export const dayNamesShort = [ "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat" ];
export const dayNamesMin = [ "Su","Mo","Tu","We","Th","Fr","Sa" ];
export const dayNamesLetters = [ "S", "M", "T", "W", "T", "F", "S" ];

export const weekHeader = "Wk";
export const dateFormat = "mm/dd/yy";

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
