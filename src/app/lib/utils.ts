export const formatDateToLocal = (
  date: Date | string | null | undefined,
  locale: string = 'en-US',
): string | null => {
  if (!date) return null;
  
  const dateObject = date instanceof Date ? date : new Date(date);
  
  if (isNaN(dateObject.getTime())) return null; // Invalid date
  
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  };
  
  const formatter = new Intl.DateTimeFormat(locale, options);
  return formatter.format(dateObject);
};