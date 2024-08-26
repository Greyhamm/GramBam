export const formatDateToLocal = (
  dateStr: string | null | undefined,
  locale: string = 'en-US',
): string => {
  if (!dateStr) return 'No due date';
  
  const date = new Date(dateStr);
  if (isNaN(date.getTime()) || date.getFullYear() < 1970) return 'No due date';

  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  };
  const formatter = new Intl.DateTimeFormat(locale, options);
  return formatter.format(date);
};