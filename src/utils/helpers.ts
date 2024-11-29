export const formatDate = (date: string | Date): string => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  
  export const debounce = <T extends (...args: unknown[]) => void>(func: T, delay: number): T => {
    let timeout: NodeJS.Timeout;
    return ((...args: unknown[]) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), delay);
    }) as T;
  };
  