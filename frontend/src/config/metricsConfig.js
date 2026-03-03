export const API_SOURCES = {
  CRUX_API: "crux-api",
  CRUX_BIGQUERY: "crux-bigquery",
};

export const DEFAULT_PAGE_SIZE = 10;

export const METRIC_COLUMNS = [
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
  },
  {
    field: "inp",
    headerName: "INP (ms)",
    width: 130,
    type: "number",
    sortable: true,
    filterable: true,
  },
  {
    field: "fcp",
    headerName: "FCP (seconds)",
    width: 130,
    type: "number",
    sortable: true,
    filterable: true,
  },
  {
    field: "cls",
    headerName: "CLS (score)",
    width: 130,
    type: "number",
    sortable: true,
    filterable: true,
  },
];
