import dayjs, { ConfigType } from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import advancedFormatPlugin from 'dayjs/plugin/advancedFormat';

dayjs.extend(localizedFormat);
dayjs.extend(advancedFormatPlugin);

/**
 * Formats a given date into a specified format.
 * @param {ConfigType} date - The date to format.
 * @param {string} [format='L'] - The format string (default is 'L').
 * @returns {string} The formatted date string.
 */
export const formatDate = (date: ConfigType, format: string = 'L'): string => {
  return dayjs(date).format(format);
};
