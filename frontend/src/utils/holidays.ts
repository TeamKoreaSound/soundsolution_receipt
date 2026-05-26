import { KR_FIXED_HOLIDAYS, KR_VARIABLE_HOLIDAYS } from './constants';

export const isKoreanHoliday = (y: number, m: number, d: number): boolean => {
  const mm = String(m).padStart(2, '0');
  const dd = String(d).padStart(2, '0');
  if (KR_FIXED_HOLIDAYS[`${mm}-${dd}`]) return true;
  if (KR_VARIABLE_HOLIDAYS[`${y}-${mm}-${dd}`]) return true;
  return false;
};
