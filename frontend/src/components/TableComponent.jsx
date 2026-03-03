import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useMetrics } from "../context/MetricsContext";
import { useFilters } from "../hooks/useFilters";
import { useSort } from "../hooks/useSort";

const TableComponent = () => {
  const { data, loading, pagination, setPagination } = useMetrics();
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
        paginationModel={{
          page: Math.max((pagination.pageNumber || 1) - 1, 0),
          pageSize: pagination.pageSize || 10,
        }}
        onPaginationModelChange={(model) => {
          setPagination({
            pageNumber: model.page + 1,
            pageSize: model.pageSize,
          });
        }}
        pageSizeOptions={[5, 10, 20, 50]}
        disableRowSelectionOnClick
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
