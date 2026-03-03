import { useMemo } from "react";
import { useMetrics } from "../context/MetricsContext";

export const useSort = (rows) => {
  const { sort, setSort } = useMetrics();

  const sortedRows = useMemo(() => {
    if (!sort.field || !rows) {
      return rows;
    }

    const sorted = [...rows].sort((a, b) => {
      const aValue = a[sort.field];
      const bValue = b[sort.field];

      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      let comparison = 0;

      if (typeof aValue === "number" && typeof bValue === "number") {
        comparison = aValue - bValue;
      } else if (typeof aValue === "string" && typeof bValue === "string") {
        comparison = aValue.localeCompare(bValue);
      } else {
        comparison = String(aValue).localeCompare(String(bValue));
      }

      return sort.direction === "asc" ? comparison : -comparison;
    });

    return sorted;
  }, [rows, sort.field, sort.direction]);

  const handleSort = (field) => {
    if (sort.field === field) {
      // Toggle direction
      setSort({
        ...sort,
        direction: sort.direction === "asc" ? "desc" : "asc",
      });
    } else {
      // New field
      setSort({
        field,
        direction: "asc",
      });
    }
  };

  return {
    sortedRows,
    sort,
    handleSort,
  };
};
