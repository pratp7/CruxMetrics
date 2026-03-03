import React from "react";
import { Box, Typography } from "@mui/material";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("ErrorBoundary caught an error", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box p={4} textAlign="center">
          <Typography variant="h5" color="error">
            Something went wrong.
          </Typography>
          <Typography>{this.state.error?.toString()}</Typography>
        </Box>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
