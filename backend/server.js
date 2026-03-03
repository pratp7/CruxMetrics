import express from "express";
import cors from "cors";
import { loggerMiddleware, logger } from "./utils/logger.js";
import { errorMiddleware } from "./utils/errorHandler.js";
import {
  getCruxAPI,
  getCruxBigQuery,
  healthCheck,
} from "./controllers/cruxController.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
// enable CORS for development; allow any origin or use dynamic origin
// allow all origins during development (replace with whitelist in production)
app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(express.json());
app.use(loggerMiddleware);

// Health Check Route
app.get("/api/health", healthCheck);

// CrUX API Routes
app.post("/api/crux-api", getCruxAPI);

// CrUX BigQuery Routes
app.post("/api/crux-bigquery", getCruxBigQuery);

// Root endpoint
app.get("/", (req, res) => {
  res.json({ message: "Welcome to CruxMetrics Backend API" });
});

// 404 handler
app.use((req, res) => {
  res
    .status(404)
    .json({ success: false, error: "Endpoint not found", path: req.path });
});

// Error handling middleware (must be last)
app.use(errorMiddleware);

// Start server
app.listen(PORT, () => {
  logger.info(`Server is running on http://localhost:${PORT}`);
});
