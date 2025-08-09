import { useState, useEffect } from 'react';

export const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [hasNetworkError, setHasNetworkError] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setHasNetworkError(false);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setHasNetworkError(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const reportNetworkError = () => {
    setHasNetworkError(true);
  };

  return {
    isOnline,
    hasNetworkError,
    reportNetworkError,
  };
};
