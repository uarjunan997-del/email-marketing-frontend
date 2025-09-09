import { useState, useEffect, useCallback, useRef } from 'react';

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const callbackRef = useRef(callback);
  const timeoutRef = useRef<NodeJS.Timeout>();

  // Update callback ref when callback changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const debouncedCallback = useCallback(
    ((...args: any[]) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callbackRef.current(...args);
      }, delay);
    }) as T,
    [delay]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return debouncedCallback;
}

export function useThrottle<T>(value: T, limit: number): T {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastRan = useRef(Date.now());

  useEffect(() => {
    const handler = setTimeout(() => {
      if (Date.now() - lastRan.current >= limit) {
        setThrottledValue(value);
        lastRan.current = Date.now();
      }
    }, limit - (Date.now() - lastRan.current));

    return () => {
      clearTimeout(handler);
    };
  }, [value, limit]);

  return throttledValue;
}

// Hook for optimized search with debouncing and caching
export function useOptimizedSearch<T>(
  searchFunction: (query: string) => Promise<T>,
  delay: number = 300
) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const cache = useRef<Map<string, T>>(new Map());
  const abortController = useRef<AbortController | null>(null);

  const debouncedQuery = useDebounce(query, delay);

  const search = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults(null);
      setLoading(false);
      setError(null);
      return;
    }

    // Check cache first
    if (cache.current.has(searchQuery)) {
      setResults(cache.current.get(searchQuery)!);
      setLoading(false);
      setError(null);
      return;
    }

    // Cancel previous request
    if (abortController.current) {
      abortController.current.abort();
    }

    abortController.current = new AbortController();
    setLoading(true);
    setError(null);

    try {
      const result = await searchFunction(searchQuery);
      
      // Only update if this is still the current search
      if (!abortController.current.signal.aborted) {
        setResults(result);
        cache.current.set(searchQuery, result);
        setLoading(false);
      }
    } catch (err) {
      if (!abortController.current.signal.aborted) {
        setError(err instanceof Error ? err.message : 'Search failed');
        setLoading(false);
      }
    }
  }, [searchFunction]);

  useEffect(() => {
    search(debouncedQuery);
  }, [debouncedQuery, search]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortController.current) {
        abortController.current.abort();
      }
    };
  }, []);

  return {
    query,
    setQuery,
    results,
    loading,
    error,
    clearCache: () => cache.current.clear()
  };
}

// Hook for managing filter state with debouncing
export function useDebouncedFilters<T extends Record<string, any>>(
  initialFilters: T,
  delay: number = 500
) {
  const [filters, setFilters] = useState<T>(initialFilters);
  const [debouncedFilters, setDebouncedFilters] = useState<T>(initialFilters);

  const debouncedSetFilters = useDebouncedCallback((newFilters: T) => {
    setDebouncedFilters(newFilters);
  }, delay);

  useEffect(() => {
    debouncedSetFilters(filters);
  }, [filters, debouncedSetFilters]);

  const updateFilter = useCallback((key: keyof T, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(initialFilters);
    setDebouncedFilters(initialFilters);
  }, [initialFilters]);

  return {
    filters,
    debouncedFilters,
    setFilters,
    updateFilter,
    resetFilters
  };
}
