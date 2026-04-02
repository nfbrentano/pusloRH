/**
 * Formats an ISO date string into a localized Brazilian format (DD/MM/YYYY)
 */
export const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  try {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  } catch {
    return dateString;
  }
};
