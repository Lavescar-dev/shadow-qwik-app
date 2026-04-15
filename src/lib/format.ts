export const formatCurrency = (value: number) => `$${value.toFixed(2)}`;
export const renderStars = (rate: number) => '★'.repeat(rate) + '☆'.repeat(5 - rate);
export const createChecksum = (value: string) => {
  const raw = Array.from(value).reduce((sum, char, index) => sum + char.charCodeAt(0) * (index + 17), 0);
  return raw.toString(16).toUpperCase().padStart(12, '0').slice(0, 12);
};
