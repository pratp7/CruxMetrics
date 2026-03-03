import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useMetrics } from "../context/MetricsContext";
import { useFilters } from "../hooks/useFilters";
import { useSort } from "../hooks/useSort";

const TableComponent = () => {
  const { data, loading, pagination } = useMetrics();
  const { filteredRows } = useFilters();
  const { sortedRows, handleSort, sort } = useSort(filteredRows);

  const rows = sortedRows || data.rows;

  const columns = data.columns || [];

  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        loading={loading}
        pageSize={pagination.pageSize}
        rowsPerPageOptions={[5, 10, 20, 50]}
        paginationMode="client"
        onSortModelChange={(model) => {
          if (model.length) {
            handleSort(model[0].field);
          }
        }}
        sortModel={
          sort.field ? [{ field: sort.field, sort: sort.direction }] : []
        }
      />
    </div>
  );
};

export default TableComponent;
