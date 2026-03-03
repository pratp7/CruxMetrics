import {
  validateUrls,
  validateOriginForBigQuery,
} from "../utils/validators.js";
import { CruxError } from "../utils/errorHandler.js";
import { ERROR_CODES, MAX_URLS_PER_REQUEST } from "../utils/constants.js";
import { fetchCruxData } from "../services/cruxService.js";
import { queryCruxBigQuery } from "../services/bigQueryService.js";
import {
  processCruxApiResponse,
  processBigQueryResponse,
  calculateAggregations,
  formatResponse,
} from "../services/responseProcessor.js";
import { logger } from "../utils/logger.js";

/**
 * POST /api/crux-api
 * Fetch Chrome UX Report API data for given URLs
 */
export const getCruxAPI = async (req, res, next) => {
  try {
    const { urls } = req.body;
    const apiKey = process.env.CRUX_API_KEY || null;

    // Validate URLs
    const validation = validateUrls(urls);
    if (!validation.valid) {
      throw new CruxError(validation.error, ERROR_CODES.VALIDATION_ERROR, 400);
    }

    // Check URL limit
    if (validation.urls.length > MAX_URLS_PER_REQUEST) {
      throw new CruxError(
        `Maximum ${MAX_URLS_PER_REQUEST} URLs allowed per request`,
        ERROR_CODES.VALIDATION_ERROR,
        400,
      );
    }

    logger.info("Processing CrUX API request", {
      urlCount: validation.urls.length,
      useDummyData: true,
    });

    // Fetch data from CrUX API or use dummy data
    const apiResponse = await fetchCruxData(validation.urls, apiKey, true);

    // Process response to standardized format
    const { rows, columns } = processCruxApiResponse(
      apiResponse,
      validation.urls,
    );

    // Calculate aggregations if multiple URLs
    const aggregated =
      validation.urls.length > 1
        ? calculateAggregations(rows, "crux-api")
        : null;

    const formatted = formatResponse(rows, columns, aggregated);

    res.status(200).json({
      success: true,
      source: "crux-api",
      ...formatted,
      cachedAt: null,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/crux-bigquery
 * Query CrUX data from BigQuery for given origins
 */
export const getCruxBigQuery = async (req, res, next) => {
  try {
    const { urls } = req.body;
    const projectId = process.env.GOOGLE_PROJECT_ID || null;

    // Validate URLs
    const validation = validateUrls(urls);
    if (!validation.valid) {
      throw new CruxError(validation.error, ERROR_CODES.VALIDATION_ERROR, 400);
    }

    // Validate that all URLs are origin-level for BigQuery
    validation.urls.forEach((url) => {
      const originValidation = validateOriginForBigQuery(url);
      if (!originValidation.valid) {
        throw new CruxError(
          originValidation.error,
          ERROR_CODES.VALIDATION_ERROR,
          400,
        );
      }
    });

    // Check URL limit
    if (validation.urls.length > MAX_URLS_PER_REQUEST) {
      throw new CruxError(
        `Maximum ${MAX_URLS_PER_REQUEST} URLs allowed per request`,
        ERROR_CODES.VALIDATION_ERROR,
        400,
      );
    }

    logger.info("Processing BigQuery request", {
      urlCount: validation.urls.length,
    });

    // Query data from BigQuery or use dummy data
    const queryResults = await queryCruxBigQuery(
      validation.urls,
      projectId,
      true,
    ); // useDummyData = true

    // Process response to standardized format
    const { rows, columns } = processBigQueryResponse(
      queryResults,
      validation.urls,
    );

    // Calculate aggregations if multiple URLs
    const aggregated =
      validation.urls.length > 1
        ? calculateAggregations(rows, "crux-bigquery")
        : null;

    const formatted = formatResponse(rows, columns, aggregated);

    res.status(200).json({
      success: true,
      source: "crux-bigquery",
      ...formatted,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/health
 * Health check endpoint
 */
export const healthCheck = (req, res) => {
  res.status(200).json({
    success: true,
    message: "CruxMetrics Backend is running",
    timestamp: new Date().toISOString(),
  });
};
