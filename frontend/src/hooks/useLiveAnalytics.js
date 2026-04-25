import { useCallback, useEffect, useState } from 'react';
import { getLiveStats } from '../utils/gazeApi';

export function useLiveAnalytics(pollMs = 3000) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const refresh = useCallback(async () => {
    try {
      const next = await getLiveStats();
      setData(next);
      setError('');
    } catch (err) {
      setError(err?.message || 'Failed to load live analytics');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    const timer = setInterval(refresh, pollMs);
    return () => clearInterval(timer);
  }, [pollMs, refresh]);

  return {
    data,
    loading,
    error,
    refresh,
  };
}
