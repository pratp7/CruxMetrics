import { useMemo } from "react";
import { useMetrics } from "../context/MetricsContext";

export const useFilters = () => {
  const { data, filters, addFilter, removeFilter, clearFilters } = useMetrics();

  const filteredRows = useMemo(() => {
    if (!data.rows || filters.length === 0) {
      return data.rows;
    }

    return data.rows.filter((row) => {
      return filters.every((filter) => {
        const value = row[filter.field];

        switch (filter.type) {
          case "threshold":
            if (filter.operator === "gt") {
              return value > filter.value;
            }
            if (filter.operator === "lt") {
              return value < filter.value;
            }
            if (filter.operator === "eq") {
              return value === filter.value;
            }
            return true;

          case "range":
            return value >= filter.min && value <= filter.max;

          case "contains":
            return String(value)
              .toLowerCase()
              .includes(String(filter.value).toLowerCase());

          case "equals":
            return (
              String(value).toLowerCase() === String(filter.value).toLowerCase()
            );

          default:
            return true;
        }
      });
    });
  }, [data.rows, filters]);

  return {
    filters,
    filteredRows,
    addFilter,
    removeFilter,
    clearFilters,
  };
};
