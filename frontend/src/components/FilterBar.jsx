import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Chip,
} from "@mui/material";
import { useMetrics } from "../context/MetricsContext";
import { METRIC_COLUMNS } from "../config/metricsConfig";

const operators = [
  { value: "gt", label: ">" },
  { value: "lt", label: "<" },
  { value: "eq", label: "=" },
];

const FilterBar = () => {
  const { filters, addFilter, removeFilter, clearFilters } = useMetrics();
  const [metric, setMetric] = useState("url");
  const [operator, setOperator] = useState("gt");
  const [value, setValue] = useState("");

  const handleAdd = () => {
    if (!metric || !operator || value === "") return;
    addFilter({
      field: metric,
      type: "threshold",
      operator,
      value: parseFloat(value),
    });
    setValue("");
  };

  return (
    <Box display="flex" alignItems="center" mb={2} flexWrap="wrap">
      <FormControl size="small" style={{ minWidth: 120, marginRight: 8 }}>
        <InputLabel>Metric</InputLabel>
        <Select
          value={metric}
          label="Metric"
          onChange={(e) => setMetric(e.target.value)}
        >
          {METRIC_COLUMNS.map((col) => (
            <MenuItem key={col.field} value={col.field}>
              {col.headerName}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl size="small" style={{ minWidth: 80, marginRight: 8 }}>
        <InputLabel>Op</InputLabel>
        <Select
          value={operator}
          label="Op"
          onChange={(e) => setOperator(e.target.value)}
        >
          {operators.map((op) => (
            <MenuItem key={op.value} value={op.value}>
              {op.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        size="small"
        label="Value"
        variant="outlined"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        style={{ width: 100, marginRight: 8 }}
      />

      <Button variant="outlined" onClick={handleAdd} disabled={value === ""}>
        Add Filter
      </Button>
      {filters.length > 0 && (
        <Button
          variant="text"
          color="secondary"
          onClick={clearFilters}
          style={{ marginLeft: 8 }}
        >
          Clear All
        </Button>
      )}

      {/* display chips */}
      <Box display="flex" flexWrap="wrap" mt={1} ml={2}>
        {filters.map((f, idx) => (
          <Chip
            key={idx}
            label={`${f.field} ${operators.find((o) => o.value === f.operator)?.label} ${f.value}`}
            onDelete={() => removeFilter(idx)}
            style={{ marginRight: 4, marginBottom: 4 }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default FilterBar;
