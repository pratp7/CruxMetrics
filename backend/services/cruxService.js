import axios from "axios";
import { logger } from "../utils/logger.js";
import { CruxError, createErrorResponse } from "../utils/errorHandler.js";
import { ERROR_CODES } from "../utils/constants.js";
import cruxDummyData from "../config/cruxApiDummyData.js"; // now exports JS object

const CRUX_API_ENDPOINT =
  "https://chromeuxreport.googleapis.com/v1/records:queryRecord";

/**
 * Fetch data from Chrome UX Report API
 * Note: Requires valid API key from Google Cloud Console
 */
export const fetchCruxData = async (
  urls,
  apiKey = null,
  useDummyData = true,
) => {
  try {
    logger.info("Fetching CrUX data", { urls, useDummyData });

    // Use dummy data for now (until API key is provided)
    if (useDummyData || !apiKey) {
      return generateDummyCruxResponse(urls);
    }

    // Real API implementation (will be used when API key is available)
    const results = {};

    for (const url of urls) {
      try {
        const response = await axios.post(
          CRUX_API_ENDPOINT,
          {
            record: {
              key: {
                url: url,
              },
            },
          },
          {
            params: {
              key: apiKey,
            },
            timeout: 10000,
          },
        );

        results[url] = processCruxApiResponse(response.data);
      } catch (error) {
        logger.error(`Error fetching CrUX data for ${url}`, {
          error: error.message,
        });

        // If API fails and dummy data is enabled, use dummy for this URL
        if (useDummyData) {
          results[url] = processCruxApiResponse(
            cruxDummyData.google_crux_api.record,
          );
        } else {
          throw new CruxError(
            `Failed to fetch data for ${url}`,
            ERROR_CODES.API_QUOTA_EXCEEDED,
            500,
          );
        }
      }
    }

    return results;
  } catch (error) {
    logger.error("CrUX API Error:", { error: error.message });
    throw error;
  }
};

/**
 * Process CrUX API response to extract metrics
 */
const processCruxApiResponse = (data) => {
  const metrics = data.metrics || {};

  return {
    lcp: metrics.largest_contentful_paint?.percentile_values?.[0] / 1000 || 0, // Convert ms to seconds
    inp: metrics.interaction_to_next_paint?.percentile_values?.[0] || 0, // Already in ms
    fcp: metrics.first_contentful_paint?.percentile_values?.[0] / 1000 || 0, // Convert ms to seconds
    cls: metrics.cumulative_layout_shift?.percentile_values?.[0] || 0, // Already a score
  };
};

/**
 * Generate dummy CrUX data for testing (when API key not available)
 */
const generateDummyCruxResponse = (urls) => {
  const results = {};

  urls.forEach((url) => {
    // Generate realistic but varying data for each URL
    const seed = url.split("").reduce((a, b) => a + b.charCodeAt(0), 0);
    const variance = (seed % 100) / 100;

    results[url] = {
      lcp: parseFloat((2.0 + variance * 2).toFixed(2)), // 2.0 - 4.0 seconds
      inp: parseInt(80 + variance * 200), // 80 - 280 ms
      fcp: parseFloat((1.2 + variance * 1.5).toFixed(2)), // 1.2 - 2.7 seconds
      cls: parseFloat((0.05 + variance * 0.15).toFixed(2)), // 0.05 - 0.20 score
    };
  });

  logger.info("Generated dummy CrUX data", { urlCount: urls.length });
  return results;
};

/**
 * Validate if URL has actual CrUX data available (optional check)
 */
export const validateUrlHasData = async (url, apiKey = null) => {
  try {
    const data = await fetchCruxData([url], apiKey, false); // Don't use dummy for validation
    return !!data[url];
  } catch (error) {
    logger.warn(`URL validation failed for ${url}`, { error: error.message });
    return false;
  }
};
