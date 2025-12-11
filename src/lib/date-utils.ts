export const getDaysInMonth = (date: Date): number => {
  const year = date.getFullYear();
  const month = date.getMonth();
  return new Date(year, month + 1, 0).getDate();
};

export const getFirstDayOfMonth = (date: Date): number => {
  const year = date.getFullYear();
  const month = date.getMonth();
  return new Date(year, month, 1).getDay();
};

export const formatDateKey = (date: Date): string => {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

export const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export const isDateFuture = (date: Date, day: number): boolean => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const checkDate = new Date(date.getFullYear(), date.getMonth(), day);
  checkDate.setHours(0, 0, 0, 0);
  return checkDate > today;
};

export const isDatePast = (date: Date, day: number): boolean => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const checkDate = new Date(date.getFullYear(), date.getMonth(), day);
  checkDate.setHours(0, 0, 0, 0);
  return checkDate < today;
};

export const isDateToday = (date: Date, day: number): boolean => {
  const today = new Date();
  const checkDate = new Date(date.getFullYear(), date.getMonth(), day);
  return formatDateKey(today) === formatDateKey(checkDate);
};
