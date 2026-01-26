export const isFutureDate = (date: string): boolean => {
  return new Date(date) > new Date();
};
