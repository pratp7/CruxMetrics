import React, { useState } from "react";
import {
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import { useCruxAPI } from "../hooks/useCruxAPI";
import { API_SOURCES } from "../config/metricsConfig";

const SearchComponent = () => {
  const [urlInput, setUrlInput] = useState("");
  const [source, setSource] = useState(API_SOURCES.CRUX_API);
  const [error, setError] = useState(null);

  const { fetchCruxData, abortRequest } = useCruxAPI();

  const handleSearch = () => {
    setError(null);

    if (!urlInput.trim()) {
      setError("Please enter at least one URL");
      return;
    }

    const urls = urlInput
      .split(/\r?\n|\s+/)
      .map((u) => u.trim())
      .filter((u) => u.length > 0);

    if (urls.length === 0) {
      setError("Please provide valid URL(s)");
      return;
    }

    // Cancel any previous request
    abortRequest();

    fetchCruxData(urls, source);
  };

  return (
    <div style={{ marginBottom: 20 }}>
      <FormControl fullWidth style={{ marginBottom: 12 }}>
        <InputLabel>Source</InputLabel>
        <Select
          value={source}
          label="Source"
          onChange={(e) => setSource(e.target.value)}
        >
          <MenuItem value={API_SOURCES.CRUX_API}>CrUX API</MenuItem>
          <MenuItem value={API_SOURCES.CRUX_BIGQUERY}>BigQuery</MenuItem>
        </Select>
      </FormControl>

      <TextField
        label="URL(s)"
        placeholder="Enter one URL per line"
        multiline
        rows={3}
        fullWidth
        variant="outlined"
        value={urlInput}
        onChange={(e) => setUrlInput(e.target.value)}
        error={!!error}
        helperText={error}
      />

      <Button
        variant="contained"
        color="primary"
        onClick={handleSearch}
        style={{ marginTop: 12 }}
      >
        Search
      </Button>
    </div>
  );
};

export default SearchComponent;
