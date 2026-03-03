import { ORIGIN_PATTERN, URL_PATTERN } from "./constants.js";

export const validateUrls = (urls) => {
  if (!Array.isArray(urls) || urls.length === 0) {
    return {
      valid: false,
      error: "URLs array is required and must not be empty",
    };
  }

  const errors = [];
  const validatedUrls = [];

  urls.forEach((url, index) => {
    const trimmed = url.trim();
    if (!trimmed) {
      errors.push(`URL at index ${index} is empty`);
      return;
    }

    if (!URL_PATTERN.test(trimmed)) {
      errors.push(`URL at index ${index} (${trimmed}) is invalid format`);
      return;
    }

    validatedUrls.push(trimmed);
  });

  return {
    valid: errors.length === 0,
    urls: validatedUrls,
    error: errors.length > 0 ? errors.join("; ") : null,
  };
};

export const validateOriginForBigQuery = (url) => {
  if (!ORIGIN_PATTERN.test(url)) {
    return {
      valid: false,
      error: "Must be an origin-level URL (e.g., https://example.com)",
    };
  }
  return { valid: true };
};

export const validateApiKey = (key) => {
  if (!key || typeof key !== "string" || key.length === 0) {
    return { valid: false, error: "API key is required" };
  }
  return { valid: true };
};

export const normalizeUrl = (url) => {
  try {
    const urlObj = new URL(url);
    return urlObj.origin;
  } catch (error) {
    return url;
  }
};

export const isOriginUrl = (url) => {
  return ORIGIN_PATTERN.test(url);
};
