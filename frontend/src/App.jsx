import React from "react";
import { Container, Typography } from "@mui/material";

import { MetricsProvider } from "./context/MetricsContext";
import { CacheProvider } from "./context/CacheContext";
import SearchComponent from "./components/SearchComponent";
import TableComponent from "./components/TableComponent";
import PaginationComponent from "./components/PaginationComponent";
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
          <PaginationComponent />
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
        maxWidth="md"
        style={{
          paddingTop: "2rem",
          backgroundColor: "#fff",
          minHeight: "100vh",
        }}
      >
        <Typography variant="h4" gutterBottom>
          CruxMetrics Analyzer
        </Typography>
        <ErrorBoundary>
          <AppContent />
        </ErrorBoundary>
      </Container>
    </CacheProvider>
  </MetricsProvider>
);

export default App;
