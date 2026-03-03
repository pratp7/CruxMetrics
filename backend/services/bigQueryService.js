import { logger } from "../utils/logger.js";
import { CruxError } from "../utils/errorHandler.js";
import { ERROR_CODES } from "../utils/constants.js";
import { isOriginUrl } from "../utils/validators.js";
import cruxBigQueryDummyData from "../config/cruxBigQueryDummyData.js"; // JS module

/**
 * Query CrUX data from BigQuery
 * Note: Requires Google Cloud BigQuery credentials and CrUX public dataset access
 */
export const queryCruxBigQuery = async (
  urls,
  projectId = null,
  useDummyData = true,
) => {
  try {
    logger.info("Querying CrUX BigQuery", { urls, useDummyData });

    // Validate that all URLs are origin-level (required for BigQuery dataset)
    urls.forEach((url) => {
      if (!isOriginUrl(url)) {
        throw new CruxError(
          `BigQuery only supports origin-level URLs. Provided: ${url}`,
          ERROR_CODES.VALIDATION_ERROR,
          400,
        );
      }
    });

    // Use dummy data for now (until credentials are provided)
    if (useDummyData || !projectId) {
      return generateDummyBigQueryResponse(urls);
    }

    // Real BigQuery implementation (will be used when credentials available)
    // const bigquery = new BigQuery({ projectId });
    // const query = buildCruxQuery(urls);
    // const [rows] = await bigquery.query({ query });
    // return rows;

    return generateDummyBigQueryResponse(urls);
  } catch (error) {
    logger.error("BigQuery Error:", { error: error.message });
    throw error;
  }
};

/**
 * Build BigQuery SQL query for CrUX data
 * This will be used when real BigQuery credentials are available
 */
const buildCruxQuery = (urls) => {
  const urlCondition = urls.map((url) => `'${url}'`).join(",");

  return `
    SELECT
      origin,
      metric,
      form_factor,
      SAFE.INT64(SUBSTR(p75, 0, FIND_IN_SET(p75, STRUCT('good', 'ni', 'poor')))) AS p75_metric,
      CAST(p75 AS STRING) AS p75_string,
    FROM \`chrome-ux-report.all.202401\`
    WHERE origin IN (${urlCondition})
    LIMIT 100
  `;
};

/**
 * Generate dummy BigQuery response for testing (when credentials not available)
 */
const generateDummyBigQueryResponse = (urls) => {
  const results = [];
  const metrics = [
    "largest_contentful_paint",
    "interaction_to_next_paint",
    "first_contentful_paint",
    "cumulative_layout_shift",
  ];
  const formFactors = ["mobile", "desktop"];

  urls.forEach((origin) => {
    metrics.forEach((metric) => {
      formFactors.forEach((formFactor) => {
        // Generate realistic distribution data
        const seed = `${origin}${metric}${formFactor}`
          .split("")
          .reduce((a, b) => a + b.charCodeAt(0), 0);
        const variance = (seed % 100) / 100;

        results.push({
          origin,
          metric,
          form_factor: formFactor,
          good_density: parseFloat((0.7 + variance * 0.2).toFixed(2)),
          ni_density: parseFloat((0.2 - variance * 0.08).toFixed(2)),
          poor_density: parseFloat((0.1 - variance * 0.05).toFixed(2)),
          total_count: Math.floor(100000 + variance * 400000),
        });
      });
    });
  });

  logger.info("Generated dummy BigQuery data", { resultCount: results.length });
  return results;
};

/**
 * Format BigQuery results for display
 */
export const formatBigQueryResults = (rows) => {
  return rows.map((row) => ({
    origin: row.origin,
    metric: row.metric,
    form_factor: row.form_factor,
    good_density: parseFloat(row.good_density) || 0,
    ni_density: parseFloat(row.ni_density) || 0,
    poor_density: parseFloat(row.poor_density) || 0,
    total_count: parseInt(row.total_count) || 0,
  }));
};

/**
 * Get sample BigQuery public dataset query
 * Reference: https://developer.chrome.com/docs/crux/bigquery
 */
export const getPublicDatasetQuery = (origin) => {
  return `
    SELECT
      date,
      origin,
      metric,
      percentile,
      ROUND(value, 3) as value,
      form_factor,
      COUNT(*) as count
    FROM \`chrome-ux-report.all.202401\`
    WHERE origin = '${origin}'
    GROUP BY date, origin, metric, percentile, value, form_factor
    LIMIT 1000
  `;
};
