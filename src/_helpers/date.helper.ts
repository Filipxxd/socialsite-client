export function formatDate(date: string | Date): string {
  const dateObj = new Date(date);

  const padToTwoDigits = (num: number) => num.toString().padStart(2, '0');

  const day = padToTwoDigits(dateObj.getDate());
  const month = padToTwoDigits(dateObj.getMonth() + 1);
  const year = dateObj.getFullYear();
  const hours = padToTwoDigits(dateObj.getHours());
  const minutes = padToTwoDigits(dateObj.getMinutes());

  return `${day}. ${month}. ${year} ${hours}:${minutes}`;
}