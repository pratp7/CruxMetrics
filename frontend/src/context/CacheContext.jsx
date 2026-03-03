import React, { createContext, useContext, useState, useCallback } from "react";

const CacheContext = createContext();

export const CacheProvider = ({ children }) => {
  const [cache, setCache] = useState(new Map());

  const addToCache = useCallback((key, data, ttl = 300000) => {
    // ttl in milliseconds (default 5 minutes)
    const cacheEntry = {
      data,
      timestamp: Date.now(),
      ttl,
    };
    setCache((prev) => new Map(prev).set(key, cacheEntry));
  }, []);

  const getFromCache = useCallback(
    (key) => {
      const entry = cache.get(key);
      if (!entry) return null;

      // Check if cache is expired
      const now = Date.now();
      const age = now - entry.timestamp;

      if (age > entry.ttl) {
        // Cache expired
        setCache((prev) => {
          const newCache = new Map(prev);
          newCache.delete(key);
          return newCache;
        });
        return null;
      }

      return {
        ...entry.data,
        cachedAt: new Date(entry.timestamp),
        cacheAge: Math.floor(age / 1000), // seconds
      };
    },
    [cache],
  );

  const invalidateCache = useCallback((key) => {
    setCache((prev) => {
      const newCache = new Map(prev);
      newCache.delete(key);
      return newCache;
    });
  }, []);

  const clearCache = useCallback(() => {
    setCache(new Map());
  }, []);

  const isCached = useCallback(
    (key) => {
      return cache.has(key);
    },
    [cache],
  );

  const value = {
    cache,
    addToCache,
    getFromCache,
    invalidateCache,
    clearCache,
    isCached,
  };

  return (
    <CacheContext.Provider value={value}>{children}</CacheContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useCache = () => {
  const context = useContext(CacheContext);
  if (!context) {
    throw new Error("useCache must be used within CacheProvider");
  }
  return context;
};
