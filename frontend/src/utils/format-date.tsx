import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import timezone from 'dayjs/plugin/timezone'; 
import utc from 'dayjs/plugin/utc';

dayjs.extend(customParseFormat);
dayjs.extend(utc); 
dayjs.extend(timezone); 

export function formatDate(date: string): string {
  return dayjs(date, 'DD/MM/YYYY').tz('America/Sao_Paulo', true).format('YYYY-MM-DD');
}
