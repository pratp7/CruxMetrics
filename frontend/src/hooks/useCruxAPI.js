import { useCallback, useRef } from "react";
import { useMetrics } from "../context/MetricsContext";
import { useCache } from "../context/CacheContext";

// API base is relative so it works in codespaces / forwarded ports
const API_BASE_URL = import.meta.env.DEV
  ? ""
  : import.meta.env.VITE_API_BASE_URL || "";

export const useCruxAPI = () => {
  const { setLoading, setData, setError } = useMetrics();
  const { getFromCache, addToCache, isCached } = useCache();
  const abortControllerRef = useRef(null);

  const getCacheKey = useCallback((urls, source, pageNumber, pageSize) => {
    return `${source}|${urls.join(",")}|${pageNumber}|${pageSize}`;
  }, []);

  const fetchCruxData = useCallback(
    async (urls, source = "crux-api", pageNumber = 1, pageSize = 10) => {
      try {
        // Cancel previous request if any
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }

        // Create new abort controller
        abortControllerRef.current = new AbortController();

        const cacheKey = getCacheKey(urls, source, pageNumber, pageSize);

        // Check cache for single URL requests
        if (urls.length === 1 && isCached(cacheKey)) {
          const cachedData = getFromCache(cacheKey);
          if (cachedData) {
            setData(cachedData.data, cachedData.pagination, source, urls);
            return;
          }
        }

        setLoading(true);

        const endpoint =
          source === "crux-api"
            ? `${API_BASE_URL}/api/crux-api`
            : `${API_BASE_URL}/api/crux-bigquery`;

        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            urls,
            pageNumber,
            pageSize,
          }),
          signal: abortControllerRef.current.signal,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch data");
        }

        const result = await response.json();

        if (!result.success) {
          throw new Error(result.error || "Failed to fetch data");
        }

        // Cache single URL results
        if (urls.length === 1) {
          addToCache(cacheKey, result);
        }

        setData(result.data, result.pagination, source, urls);
      } catch (error) {
        if (error.name !== "AbortError") {
          setError(error.message);
          console.error("Error fetching CrUX data:", error);
        }
      } finally {
        setLoading(false);
      }
    },
    [
      setLoading,
      setData,
      setError,
      getFromCache,
      addToCache,
      isCached,
      getCacheKey,
    ],
  );

  const abortRequest = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  return {
    fetchCruxData,
    abortRequest,
  };
};
