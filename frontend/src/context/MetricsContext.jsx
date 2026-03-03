import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
} from "react";

const MetricsContext = createContext();

const initialState = {
  data: {
    rows: [],
    columns: [],
    aggregated: null,
  },
  loading: false,
  error: null,
  source: null, // 'crux-api' or 'crux-bigquery'
  filters: [],
  sort: { field: null, direction: "asc" },
  pagination: { pageSize: 10, pageNumber: 1, totalRows: 0, totalPages: 0 },
  urls: [],
};

const metricReducer = (state, action) => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload, error: null };

    case "SET_DATA":
      return {
        ...state,
        data: action.payload.data,
        pagination: action.payload.pagination,
        source: action.payload.source,
        urls: action.payload.urls,
        loading: false,
        error: null,
      };

    case "SET_ERROR":
      return {
        ...state,
        error: action.payload,
        loading: false,
        data: { rows: [], columns: [], aggregated: null },
      };

    case "ADD_FILTER":
      return {
        ...state,
        filters: [...state.filters, action.payload],
      };

    case "REMOVE_FILTER":
      return {
        ...state,
        filters: state.filters.filter((f, idx) => idx !== action.payload),
      };

    case "CLEAR_FILTERS":
      return {
        ...state,
        filters: [],
      };

    case "SET_SORT":
      return {
        ...state,
        sort: action.payload,
      };

    case "SET_PAGINATION":
      return {
        ...state,
        pagination: { ...state.pagination, ...action.payload },
      };

    case "CLEAR_DATA":
      return initialState;

    default:
      return state;
  }
};

export const MetricsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(metricReducer, initialState);

  const setLoading = useCallback((loading) => {
    dispatch({ type: "SET_LOADING", payload: loading });
  }, []);

  const setData = useCallback((data, pagination, source, urls) => {
    dispatch({
      type: "SET_DATA",
      payload: { data, pagination, source, urls },
    });
  }, []);

  const setError = useCallback((error) => {
    dispatch({ type: "SET_ERROR", payload: error });
  }, []);

  const addFilter = useCallback((filter) => {
    dispatch({ type: "ADD_FILTER", payload: filter });
  }, []);

  const removeFilter = useCallback((index) => {
    dispatch({ type: "REMOVE_FILTER", payload: index });
  }, []);

  const clearFilters = useCallback(() => {
    dispatch({ type: "CLEAR_FILTERS" });
  }, []);

  const setSort = useCallback((sort) => {
    dispatch({ type: "SET_SORT", payload: sort });
  }, []);

  const setPagination = useCallback((pagination) => {
    dispatch({ type: "SET_PAGINATION", payload: pagination });
  }, []);

  const clearData = useCallback(() => {
    dispatch({ type: "CLEAR_DATA" });
  }, []);

  const value = {
    ...state,
    setLoading,
    setData,
    setError,
    addFilter,
    removeFilter,
    clearFilters,
    setSort,
    setPagination,
    clearData,
  };

  return (
    <MetricsContext.Provider value={value}>{children}</MetricsContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useMetrics = () => {
  const context = useContext(MetricsContext);
  if (!context) {
    throw new Error("useMetrics must be used within MetricsProvider");
  }
  return context;
};
