// Core Constants
export const MAX_URLS_PER_REQUEST = 5;
export const CACHE_TTL = 300; // 5 minutes in seconds

// Web Vitals Thresholds
export const THRESHOLDS = {
  lcp: {
    good: 2.5,
    needsImprovement: 4.0,
  },
  inp: {
    good: 200,
    needsImprovement: 500,
  },
  fcp: {
    good: 1.8,
    needsImprovement: 3.0,
  },
  cls: {
    good: 0.1,
    needsImprovement: 0.25,
  },
};

// API Sources
export const API_SOURCES = {
  CRUX_API: "crux-api",
  CRUX_BIGQUERY: "crux-bigquery",
};

// Form Factors
export const FORM_FACTORS = {
  DESKTOP: "DESKTOP",
  MOBILE: "MOBILE",
  ALL_FORM_FACTORS: "ALL_FORM_FACTORS",
};

// Error Codes
export const ERROR_CODES = {
  INVALID_URL: "INVALID_URL",
  INVALID_API_KEY: "INVALID_API_KEY",
  API_QUOTA_EXCEEDED: "API_QUOTA_EXCEEDED",
  NETWORK_ERROR: "NETWORK_ERROR",
  VALIDATION_ERROR: "VALIDATION_ERROR",
  NOT_FOUND: "NOT_FOUND",
};

// URL Validation Patterns
export const URL_PATTERN =
  /^https?:\/\/([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(:\d+)?(\/$)?$/;
export const ORIGIN_PATTERN =
  /^https?:\/\/([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(:\d+)?$/;

// Metric Names
export const METRICS = {
  LCP: "largest_contentful_paint",
  INP: "interaction_to_next_paint",
  FCP: "first_contentful_paint",
  CLS: "cumulative_layout_shift",
};

// Metric Display Names
export const METRIC_LABELS = {
  largest_contentful_paint: "LCP (seconds)",
  interaction_to_next_paint: "INP (ms)",
  first_contentful_paint: "FCP (seconds)",
  cumulative_layout_shift: "CLS (score)",
};
