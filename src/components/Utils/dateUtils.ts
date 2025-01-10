export const formatDateForInput = (dateString: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toISOString().slice(0, 10);
};

export const formatDate = (dateString: string, type: 'yyyy-mm-dd' | 'dd/mm/yyyy'): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (type === 'yyyy-mm-dd') {
    return date.toISOString().slice(0, 10);
  } else if (type === 'dd/mm/yyyy') {
    const preDate = date.toISOString().slice(0, 10);
    const [year, month, day] = preDate.split('-');
    return `${day}/${month}/${year}`;
  }
  return '';
};

export const formatFullTime = (dateString: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear().toString().slice(-2);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');

  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
};

