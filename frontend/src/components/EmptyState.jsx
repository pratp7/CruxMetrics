import React from "react";
import { Box, Typography } from "@mui/material";

const EmptyState = ({ message = "No data available" }) => (
  <Box p={4} textAlign="center">
    <Typography variant="h6" color="textSecondary">
      {message}
    </Typography>
  </Box>
);

export default EmptyState;
