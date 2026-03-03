import { THRESHOLDS, METRIC_LABELS } from "../utils/constants.js";

/**
 * Convert CrUX API response to standardized rows/columns format
 */
export const processCruxApiResponse = (apiResponse, urls) => {
  const rows = [];
  const seen = new Set();

  // Define columns
  const columns = [
    {
      field: "url",
      headerName: "URL",
      width: 250,
      sortable: true,
      filterable: true,
    },
    {
      field: "lcp",
      headerName: "LCP (seconds)",
      width: 130,
      type: "number",
      sortable: true,
      filterable: true,
      threshold: THRESHOLDS.lcp,
    },
    {
      field: "inp",
      headerName: "INP (ms)",
      width: 130,
      type: "number",
      sortable: true,
      filterable: true,
      threshold: THRESHOLDS.inp,
    },
    {
      field: "fcp",
      headerName: "FCP (seconds)",
      width: 130,
      type: "number",
      sortable: true,
      filterable: true,
      threshold: THRESHOLDS.fcp,
    },
    {
      field: "cls",
      headerName: "CLS (score)",
      width: 130,
      type: "number",
      sortable: true,
      filterable: true,
      threshold: THRESHOLDS.cls,
    },
  ];

  // Process each URL's data
  urls.forEach((url) => {
    if (!seen.has(url) && apiResponse[url]) {
      seen.add(url);
      const metrics = apiResponse[url];
      rows.push({
        id: url,
        url,
        lcp: metrics.lcp ? parseFloat(metrics.lcp) : 0,
        inp: metrics.inp ? parseFloat(metrics.inp) : 0,
        fcp: metrics.fcp ? parseFloat(metrics.fcp) : 0,
        cls: metrics.cls ? parseFloat(metrics.cls) : 0,
      });
    }
  });

  return { rows, columns };
};

/**
 * Convert BigQuery response to standardized rows/columns format
 */
export const processBigQueryResponse = (queryResults, urls) => {
  const rows = [];
  const seen = new Set();

  const columns = [
    {
      field: "url",
      headerName: "URL",
      width: 250,
      sortable: true,
      filterable: true,
    },
    {
      field: "metric",
      headerName: "Metric",
      width: 200,
      sortable: true,
      filterable: true,
    },
    {
      field: "formFactor",
      headerName: "Form Factor",
      width: 150,
      sortable: true,
      filterable: true,
    },
    {
      field: "goodDensity",
      headerName: "Good (%)",
      width: 130,
      type: "number",
      sortable: true,
      filterable: true,
    },
    {
      field: "niDensity",
      headerName: "Needs Improvement (%)",
      width: 150,
      type: "number",
      sortable: true,
      filterable: true,
    },
    {
      field: "poorDensity",
      headerName: "Poor (%)",
      width: 130,
      type: "number",
      sortable: true,
      filterable: true,
    },
    {
      field: "totalCount",
      headerName: "Sample Size",
      width: 130,
      type: "number",
      sortable: true,
    },
  ];

  // Process each result
  queryResults.forEach((result, index) => {
    const url = result.origin || urls[0];
    const key = `${url}_${result.metric}_${result.form_factor}`;

    if (!seen.has(key)) {
      seen.add(key);
      rows.push({
        id: key,
        url,
        metric: result.metric || "N/A",
        formFactor: result.form_factor || "N/A",
        goodDensity: result.good_density
          ? (result.good_density * 100).toFixed(2)
          : 0,
        niDensity: result.ni_density ? (result.ni_density * 100).toFixed(2) : 0,
        poorDensity: result.poor_density
          ? (result.poor_density * 100).toFixed(2)
          : 0,
        totalCount: result.total_count || 0,
      });
    }
  });

  return { rows, columns };
};

/**
 * Calculate aggregated metrics for multiple URLs
 */
export const calculateAggregations = (rows, source) => {
  if (!rows || rows.length === 0) {
    return null;
  }

  const aggregated = {
    count: rows.length,
  };

  if (source === "crux-api") {
    // Numeric fields to aggregate
    const fields = ["lcp", "inp", "fcp", "cls"];

    fields.forEach((field) => {
      const values = rows
        .map((row) => row[field])
        .filter((v) => v !== null && v !== undefined && v !== 0);

      if (values.length > 0) {
        aggregated[`avg_${field}`] = (
          values.reduce((a, b) => a + b, 0) / values.length
        ).toFixed(2);
        aggregated[`sum_${field}`] = values
          .reduce((a, b) => a + b, 0)
          .toFixed(2);
        aggregated[`min_${field}`] = Math.min(...values).toFixed(2);
        aggregated[`max_${field}`] = Math.max(...values).toFixed(2);
      }
    });
  } else if (source === "crux-bigquery") {
    // Aggregate percentage densities
    const fields = ["goodDensity", "niDensity", "poorDensity"];

    fields.forEach((field) => {
      const values = rows
        .map((row) => parseFloat(row[field]))
        .filter((v) => !isNaN(v));

      if (values.length > 0) {
        aggregated[`avg_${field}`] = (
          values.reduce((a, b) => a + b, 0) / values.length
        ).toFixed(2);
      }
    });

    // Sum sample sizes
    const totalCounts = rows.map((row) => row.totalCount).filter((v) => v);
    if (totalCounts.length > 0) {
      aggregated.total_samples = totalCounts.reduce((a, b) => a + b, 0);
    }
  }

  return aggregated;
};

/**
 * Format response with pagination
 */
export const formatPaginatedResponse = (
  rows,
  columns,
  pageNumber = 1,
  pageSize = 10,
  aggregated = null,
) => {
  const totalRows = rows.length;
  const startIndex = (pageNumber - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedRows = rows.slice(startIndex, endIndex);

  return {
    data: {
      rows: paginatedRows,
      columns,
      ...(aggregated && { aggregated }),
    },
    pagination: {
      totalRows,
      pageSize,
      pageNumber,
      totalPages: Math.ceil(totalRows / pageSize),
    },
  };
};
