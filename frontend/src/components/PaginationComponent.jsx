import React from "react";
import { Button, Select, MenuItem, Typography } from "@mui/material";
import { usePagination } from "../hooks/usePagination";
import { useMetrics } from "../context/MetricsContext";

const PaginationComponent = () => {
  const { pagination } = useMetrics();
  const { goToPage, nextPage, prevPage, setPageSize } = usePagination();

  return (
    <div style={{ display: "flex", alignItems: "center", marginTop: 16 }}>
      <Button onClick={prevPage} disabled={pagination.pageNumber <= 1}>
        Prev
      </Button>
      <Typography style={{ margin: "0 8px" }}>
        Page {pagination.pageNumber} of {pagination.totalPages || 1}
      </Typography>
      <Button
        onClick={nextPage}
        disabled={pagination.pageNumber >= pagination.totalPages}
      >
        Next
      </Button>
      <div
        style={{ marginLeft: "auto", display: "flex", alignItems: "center" }}
      >
        <Typography>Rows:</Typography>
        <Select
          value={pagination.pageSize}
          onChange={(e) => setPageSize(Number(e.target.value))}
          style={{ marginLeft: 8, width: 80 }}
        >
          {[5, 10, 20, 50].map((size) => (
            <MenuItem key={size} value={size}>
              {size}
            </MenuItem>
          ))}
        </Select>
      </div>
    </div>
  );
};

export default PaginationComponent;
