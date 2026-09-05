// src/hooks/useFetch.js
import { useState, useEffect, useCallback } from 'react';

/**
 * Generic data-fetching hook with loading, error, and refetch support.
 * @param {Function} fetchFn - Async function that returns data
 * @param {Array} deps - Dependency array to trigger refetch
 */
export default function useFetch(fetchFn, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const execute = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchFn();
      setData(result);
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }, deps);

  useEffect(() => {
    execute();
  }, [execute]);

  return { data, loading, error, refetch: execute };
}
