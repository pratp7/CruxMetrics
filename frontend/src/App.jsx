import React from "react";
import { Box, Container, Typography } from "@mui/material";

import { MetricsProvider } from "./context/MetricsContext";
import { CacheProvider } from "./context/CacheContext";
import SearchComponent from "./components/SearchComponent";
import TableComponent from "./components/TableComponent";
import LoadingSpinner from "./components/LoadingSpinner";
import ErrorBoundary from "./components/ErrorBoundary";
import EmptyState from "./components/EmptyState";
import FilterBar from "./components/FilterBar";
import { useMetrics } from "./context/MetricsContext";

const AppContent = () => {
  const { loading, data, error } = useMetrics();

  return (
    <>
      <SearchComponent />

      {/* show filter bar only when data exists */}
      {data.rows && data.rows.length > 0 && <FilterBar />}

      {loading && <LoadingSpinner />}

      {error && <Typography color="error">{error}</Typography>}

      {!loading && !error && data.rows && data.rows.length > 0 ? (
        <>
          <TableComponent />
        </>
      ) : null}

      {!loading && !error && data.rows && data.rows.length === 0 && (
        <EmptyState message="No metrics found. Try searching a URL." />
      )}
    </>
  );
};

const App = () => (
  <MetricsProvider>
    <CacheProvider>
      <Container
        maxWidth={false}
        disableGutters
        style={{
          backgroundColor: "#fafafa",
          minHeight: "100vh",
        }}
      >
        <Box
          style={{
            width: "100%",
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "2rem 1rem",
          }}
        >
          <Typography variant="h4" gutterBottom>
            CruxMetrics Analyzer
          </Typography>
          <ErrorBoundary>
            <AppContent />
          </ErrorBoundary>
        </Box>
      </Container>
    </CacheProvider>
  </MetricsProvider>
);

export default App;
