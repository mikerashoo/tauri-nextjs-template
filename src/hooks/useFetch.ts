import { useState, useEffect } from 'react';

const useFetch = <T>(url: string): { data: T | null; error: string | null } => {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Failed to fetch');
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError((err as Error).message);
      }
    };

    fetchData();
  }, [url]);

  return { data, error };
};
 
export default useFetch;