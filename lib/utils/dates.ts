export function timestampToDate(timestamp: number): Date {
  return new Date(timestamp * 1000); // Instagram timestamps are in seconds
}

export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0]; // YYYY-MM-DD
}

export function isValidDate(date: any): date is Date {
  return date instanceof Date && !isNaN(date.getTime());
}