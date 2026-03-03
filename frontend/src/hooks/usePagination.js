import { useCallback } from "react";
import { useMetrics } from "../context/MetricsContext";

export const usePagination = () => {
  const { pagination, setPagination } = useMetrics();

  const goToPage = useCallback(
    (pageNumber) => {
      if (pageNumber >= 1 && pageNumber <= pagination.totalPages) {
        setPagination({ pageNumber });
      }
    },
    [pagination.totalPages, setPagination],
  );

  const nextPage = useCallback(() => {
    goToPage(pagination.pageNumber + 1);
  }, [goToPage, pagination.pageNumber]);

  const prevPage = useCallback(() => {
    goToPage(pagination.pageNumber - 1);
  }, [goToPage, pagination.pageNumber]);

  const setPageSize = useCallback(
    (pageSize) => {
      setPagination({ pageSize, pageNumber: 1 });
    },
    [setPagination],
  );

  return {
    pagination,
    goToPage,
    nextPage,
    prevPage,
    setPageSize,
  };
};
